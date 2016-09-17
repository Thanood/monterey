import {bindable, autoinject} from 'aurelia-framework';
import {CommandRunnerService} from './command-runner-service';
import {CommandRunner}        from './command-runner';
import {Command}              from './command';
import {TaskManager}          from './task-manager';
import {Task}                 from './task';
import {Project, ApplicationState, Notification} from '../../shared/index';

@autoinject()
export class TaskRunner {
  cache: Array<TaskRunnerState> = [];
  current: TaskRunnerState;

  // @bindable project: Project;
  favoriteTab: Element;
  favoriteTabBody: Element;
  loading: boolean;

  constructor(private taskManager: TaskManager,
              private commandRunner: CommandRunner,
              private state: ApplicationState,
              private notification: Notification) {}

  select(project: Project) {
    if (!project) {
      this.current = null;
      return;
    }

    if (!this.cache.find(x => x.project === project)) {
      this.current = { project: project, categories: [], favorites: [] };
      this.cache.push(this.current);
    } else {
      this.current = this.cache.find(x => x.project === project);
      this.current.categories.splice(0);
      this.current.favorites.splice(0);
    }

    if (!project.favoriteCommands) {
      project.favoriteCommands = [
        'gulp watch',
        'au run --watch',
        'npm start',
        'dotnet restore',
        'gulp prepare-release'
      ];
    }

    if (this.favoriteTab) {
      this.showFavoriteTab();
    } else {
      setTimeout(() => this.showFavoriteTab());
    }

    this.load();
  }

  showFavoriteTab() {
    if (this.favoriteTab) {
      $(this.favoriteTab).tab('show');
      $(this.favoriteTab).css('position', 'relative');
    }
  }

  async load() {
    this.loading = true;

    let categories: Array<Category> = [];
    let state = this.current;
    let services = await this.commandRunner.getServices(state.project);

    services.forEach(service => categories.push({
      title: service.title,
      service: service,
      commands: []
    }));

    for (let x = 0; x < categories.length; x++) {
      await this.loadCommands(state.project, categories[x], true);
    }

    state.categories = categories;

    this.loadFavorites(state);

    this.loading = false;
  }

  loadFavorites(state: TaskRunnerState) {
    if (!state.project.favoriteCommands) return;

    let categories = state.categories;
    let favorites = state.favorites;

    categories.forEach((category: Category) => {
      category.commands.forEach(command => {
        if (state.project.favoriteCommands.indexOf(command.description) > -1) {
          favorites.push({
            category: category,
            command: command
          });
        }
      });
    });
  }

  async loadCommands(project: Project, category: Category, useCache: boolean) {
    category.commands.splice(0);
    category.selectedCommand = null;
    category.error = '';
    category.loading = true;
    category.selectedCommand = null;

    try {
      category.commands = await category.service.getCommands(project, useCache);
      category.commands.forEach(command => command.description = `${command.command} ${command.args.join(' ')}`);
    } catch (e) {
      category.error = `Failed to load tasks for this project (${e.message}). Did you install the npm modules?`;
    }
    category.loading = false;

    if (!category.error && category.commands && category.commands.length === 0) {
      category.error = `Did not find any tasks`;
    }
  }

  startCommand(category: Category, command?: Command) {
    if (!command && !category.selectedCommand) {
      this.notification.warning('No task has been selected');
      return;
    }

    let task = this.commandRunner.run(this.current.project, command || category.selectedCommand);

    this.taskManager.addTask(this.current.project, task);
    this.taskManager.startTask(task);

    this.notification.success('Task has been started');
  }

  favoriteCommand(category: Category) {
    this.current.favorites.push({
      category: category,
      command: category.selectedCommand
    });

    this.current.project.favoriteCommands.push(category.selectedCommand.description);
    this.state._save();
    this.notification.success('Added the task to favorites');
  }
}

interface Category {
  service?: CommandRunnerService;
  commands: Array<Command>;
  selectedCommand?: Command;
  error?: string;
  loading?: boolean;
  title: string;
}

interface Favorite {
  category: Category;
  command: Command;
}

interface TaskRunnerState {
  project: Project;
  categories: Array<Category>;
  favorites: Array<Favorite>;
}
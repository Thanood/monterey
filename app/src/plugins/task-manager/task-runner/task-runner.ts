import {CommandRunnerService} from '../commands/command-runner-service';
import {CommandRunner}        from '../commands/command-runner';
import {Command}              from '../commands/command';
import {TaskManager}          from '../task-manager';
import {Task}                 from '../task';
import {Project, ApplicationState, Notification, bindable, autoinject} from '../../../shared/index';

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

  startCommand(command: Command) {
    let task = this.commandRunner.run(this.current.project, command);

    this.taskManager.addTask(this.current.project, task);
    this.taskManager.startTask(task);

    this.notification.success('Task has been started');
  }

  removeFavorite(favorite: Favorite) {
    if (!confirm('Are you sure?')) {
      return;
    }
    let index = this.current.favorites.indexOf(favorite);
    this.current.favorites.splice(index, 1);
  }

  favoriteCommand(command: Command) {
    this.current.favorites.push({
      command: command
    });

    this.current.project.favoriteCommands.push(`${command.command} ${command.args.join(' ')}`);
    this.state._save();
    this.notification.success('Added the task to favorites');
  }
}

export interface Category {
  service?: CommandRunnerService;
  commands: Array<Command>;
  selectedCommand?: Command;
  error?: string;
  loading?: boolean;
  title: string;
}

export interface Favorite {
  command: Command;
}

export interface TaskRunnerState {
  project: Project;
  categories: Array<Category>;
  favorites: Array<Favorite>;
}
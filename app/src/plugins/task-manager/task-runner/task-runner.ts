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

    for (let x = 0; x < services.length; x++) {
      let service = services[x];
      let category = {
        title: service.title,
        commands: []
      };

      await this.loadCommands(state.project, category, service, true);

      categories.push(category);
    }

    state.categories = categories;

    this.loadFavorites(state);

    this.loading = false;
  }

  loadFavorites(state: TaskRunnerState) {
    state.favorites = state.project.favoriteCommands.filter(x => x.command);
  }

  async loadCommands(project: Project, category: Category, service: CommandRunnerService, useCache: boolean) {
    category.commands.splice(0);
    category.selectedCommand = null;
    category.error = '';
    category.loading = true;
    category.selectedCommand = null;

    try {
      category.commands = await service.getCommands(project, useCache);
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

  removeFavorite(command: Command) {
    if (!confirm('Are you sure?')) {
      return;
    }
    let index = this.current.project.favoriteCommands.indexOf(command);
    this.current.project.favoriteCommands.splice(index, 1);

    index = this.current.favorites.indexOf(command);
    this.current.favorites.splice(index, 1);

    this.state._save();
    this.notification.success('Removed from favorites');
  }

  favoriteCommand(command: Command) {
    this.current.favorites.push(command);

    this.current.project.favoriteCommands.push(command);

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

export interface TaskRunnerState {
  project: Project;
  categories: Array<Category>;
  favorites: Array<Command>;
}
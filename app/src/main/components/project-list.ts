import {RenameModal} from './rename-modal';
import {ContextMenu} from 'context-menu/context-menu';
import {withModal, ApplicationState, Project, Notification, SelectedProject,
  ProjectManager, I18N, EventAggregator, Subscription, autoinject, bindable} from '../../shared/index';

@autoinject()
export class ProjectList {
  @bindable disabled = false;
  projectRemoved: Subscription;
  projectAdded: Subscription;
  gridDiv: Element;
  projectGrid;
  // keeps the index of the last selected row
  lastSelectedRow = 0;

  constructor(private state: ApplicationState,
              private notification: Notification,
              private projectManager: ProjectManager,
              private contextMenu: ContextMenu,
              private i18n: I18N,
              private selectedProject: SelectedProject,
              private ea: EventAggregator) {
    this.projectRemoved = ea.subscribe('ProjectRemoved', () => this.select(0));
    this.projectAdded = ea.subscribe('ProjectAdded', (project) => {
      let index = this.state.projects.indexOf(project);
      this.select(index);
    });
  }

  attached() {
    setTimeout(() => {
      // has a project been selected in a previous session?
      // if so, select this project again
      if (this.state.selectedProjectPath) {
        let index = this.state.projects.findIndex(x => x.path === this.state.selectedProjectPath);
        if (index > -1) {
          this.select(index);
        }
      } else {
        // select first row
        this.select(0);
      }

      this.contextMenu.attach(this.gridDiv, (builder, clickedElement) => this.contextMenuActivated(builder, clickedElement));
    });
  }

  contextMenuActivated(builder, clickedElement) {
    let projRow = $(clickedElement).closest('.vGrid-row')[0];
    let rowNr = $(projRow).attr('row');
    this.select(parseInt(rowNr, 0));

    builder
    .addItem({ title: this.i18n.tr('rename-project'), onClick:  () => this.renameProject() })
    .addItem({ title: this.i18n.tr('remove-project'), onClick: () => this.removeProject() });
  }

  @withModal(RenameModal)
  renameProject() {}

  select(index: number) {
    if (this.projectGrid.ctx.vGridCollection.length > index) {
      this.selectedProject.set(this.projectGrid.ctx.vGridCollection[index]);

      this.projectGrid.ctx.vGridSelection.select(index);
      this.projectGrid.ctx.vGridGenerator.updateSelectionOnAllRows();
    } else {
      this.selectedProject.set(null);
    }
  }

  projectClicked(project: { data: Project, row: number }) {
    if (this.selectedProject.current !== project.data) {
      this.lastSelectedRow = project.row;
      this.selectedProject.set(project.data);
    }
  }

  async removeProject() {
    if (!this.selectedProject.current) {
      return;
    }

    if (!confirm(this.i18n.tr('confirm-remove-project'))) {
      return;
    }

    await this.projectManager.removeProject(this.selectedProject.current);

    if (this.projectManager.state.projects.length > 0) {
      this.selectedProject.set(this.projectManager.state.projects[0]);
    } else {
      this.selectedProject.set(null);
    }
  }

  detached() {
    this.projectRemoved.dispose();
    this.projectAdded.dispose();
  }
}

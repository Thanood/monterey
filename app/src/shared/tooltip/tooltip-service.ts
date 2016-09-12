import { Container, autoinject } from 'aurelia-dependency-injection';
import { Origin } from 'aurelia-metadata';
import { CompositionEngine, ViewSlot, CompositionContext, Controller } from 'aurelia-templating';
import { TooltipRenderer } from './tooltip-renderer';
import { DOM } from 'aurelia-pal';

interface TooltipSettings {
  viewModel: any;
  model: any;
  target?: Element;
}

@autoinject()
export class TooltipService {
  _viewModel: {};
  _model: any;
  _controller: Controller;
  _showing: Promise<any>;
  _viewSlot: ViewSlot;

  constructor(private _container: Container,
              private _compositionEngine: CompositionEngine,
              private _renderer: TooltipRenderer) {
  }

  show(settings: TooltipSettings) {
    const { _container: container } = this;
    const { target, model, viewModel: tempViewModel } = settings;
    const viewModel = Origin.get(tempViewModel).moduleId;

    let host = this._renderer.getContainer();
    let instruction: CompositionContext = {
      container: this._container,
      bindingContext: {},
      overrideContext: {},
      viewResources: null,
      childContainer: this._container.createChild(),
      model: model,
      viewModel: settings.viewModel,
      viewSlot: new ViewSlot(host, true)
    };

    this._viewModel = viewModel;
    this._model = model;

    return _getViewModel(instruction, this._compositionEngine).then(returnedInstruction => {
      this._showing = invokeLifecycle(viewModel, 'canActivate', model);
      this._viewSlot = returnedInstruction.viewSlot;

      return invokeLifecycle(instruction.viewModel, 'canActivate', instruction.model)
      .then((canActivate: boolean) => {
        if (canActivate) {
          this._compositionEngine.compose(returnedInstruction)
            .then(controller => {
              this._renderer._element = host;
              this._renderer._viewSlot = returnedInstruction.viewSlot;
              this._renderer.show(settings.target);
            });
        }
      });
    });
  }

  hide() {
    if (this._showing) {
      this._showing.then(() => {
        invokeLifecycle(this._viewModel, 'canDeactivate', this._model)
          .then((canDeactivate: boolean) => {
            if (canDeactivate) {
              this._renderer.hide();
            }
          });
        });
    }
  }
}

function invokeLifecycle(instance: any, name: string, model: any) {
  if (typeof instance[name] === 'function') {
    const result = instance[name](model);

    if (result instanceof Promise) {
      return result;
    }

    if (result !== null && result !== undefined) {
      return Promise.resolve(result);
    }

    return Promise.resolve(true);
  }

  return Promise.resolve(true);
}


function _getViewModel(instruction, compositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}
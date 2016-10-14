// disabled because it stops wallabyjs from running

// import {ExitProcedure}  from '../../../src/shared/exit-procedure';
// import {OS, SESSION} from 'monterey-pal';
// import {Container} from 'aurelia-framework';

// describe('ExitProcedure', () => {
//   let sut: ExitProcedure;
//   let container: Container;

//   beforeEach(() => {
//     container = new Container();
//     sut = container.get(ExitProcedure);

//     spyOn(OS, 'kill');
//   });

//   it('kills running OS processes', async (r) => {
//     let a = { id: 1 };
//     let b = { id: 2 };
//     let c = { id: 3 };
//     OS.processes = [a, b, c];

//     await sut._cleanup({ returnValue: null });

//     expect(OS.kill).toHaveBeenCalledWith(a);
//     expect(OS.kill).toHaveBeenCalledWith(b);
//     expect(OS.kill).toHaveBeenCalledWith(c);
//     r();
//   });

//   it('sets returnValue value so that monterey does not close immediately', async (r) => {
//     spyOn(SESSION, 'getEnv').and.returnValue('production');
//     OS.processes = [{ id: 1 }, { id: 2 }, { id: 3 }];

//     let closeSpy = spyOn(window, 'close');

//     let args = { returnValue: null }
//     await sut._cleanup(args);

//     expect(args.returnValue).toBe('do not close');

//     r();
//   });

//   it('closes window in the end', async (r) => {
//     spyOn(SESSION, 'getEnv').and.returnValue('production');
//     OS.processes = [{ id: 1 }, { id: 2 }, { id: 3 }];

//     let closeSpy = spyOn(window, 'close');

//     let args = { returnValue: null }
//     await sut._cleanup(args);

//     setTimeout(() => {
//       expect(closeSpy).toHaveBeenCalled();
//       r();
//     }, 50);
//   });
// });
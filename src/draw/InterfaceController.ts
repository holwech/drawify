import { RecordController } from './recorder/RecordController';
import { BoardController } from './board/BoardController';
import { PlayController } from './player/PlayController';
import { EventController } from './event/EventController';
import { AppController } from './AppController';
import { IStrokeProps, EventType, BoardState, IEvent, IViewBox } from './utils/boardInterfaces';
import { ActionType } from './utils/appInterfaces';

export class Controller {
  public recorder: RecordController;
  public board: BoardController;
  private player: PlayController;
  private event: EventController;
  private app: AppController;
  private svg: HTMLElement & SVGElement & SVGSVGElement;

  constructor(svgID: string, strokeProps: IStrokeProps) {
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
    if (!this.svg.getScreenCTM()) {
      throw new Error('getScreenCTM is not defined');
    }
    let viewBox = { x: 0, y: 0, width: 1200, height: 800 };
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }

    const initialState = [
      { eventType: EventType.SET_STROKE_PROPS, strokeProps },
      { eventType: EventType.SET_VIEWBOX, viewBox },
    ];

    this.app = new AppController();
    this.board = new BoardController(this.svg, this.app, initialState);
    this.recorder = new RecordController(this.app, initialState);
    this.player = new PlayController(this.app);
    this.event = new EventController(this.svg, this.app);
    this.app.init(this.board, this.player, this.recorder, this.event);
  }

  public playRecording(): void {
    this.app.dispatchAction({ action: ActionType.PLAY_START });
  }

  public startRecording(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_START });
  }

  public pauseRecording(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_PAUSE });
  }

  public stopRecording(): void {
    this.app.dispatchAction({ action: ActionType.RECORD_STOP });
  }

  public clear(): void {
    this.app.dispatchEvent({ eventType: EventType.CLEAR });
  }

  public setState(state: BoardState): void {
    this.app.dispatchEvent({ eventType: EventType.SET_STATE, state });
  }

  public setStrokeProperties(strokeProps: IStrokeProps): void {
    this.app.dispatchEvent({ eventType: EventType.SET_STROKE_PROPS, strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.app.dispatchEvent({ eventType: EventType.SET_VIEWBOX, viewBox });
  }
}

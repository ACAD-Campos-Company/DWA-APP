import { Observable } from "rxjs";

export interface dashboardInformation {
  icon: string,
  title: string,
  value$: Observable<number>
}

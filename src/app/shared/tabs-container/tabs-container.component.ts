import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(tab => tab.active);

    if (!activeTabs || !activeTabs.length) {
      this.selectTab(this.tabs?.first);
    }
  }

  selectTab(tab?: TabComponent) {
    if (tab) {
      this.tabs?.forEach(tab => {
        tab.active = false;
      });
      tab.active = true;
    }
    return false;
  }
}

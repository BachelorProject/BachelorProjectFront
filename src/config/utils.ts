export class Utils {

  public static numberToMonth(mon: number) {
    switch (mon) {
      case 0:
        return 'იანვარი';
      case 1:
        return 'თებერვალი';
      case 2:
        return 'მარტი';
      case 3:
        return 'აპრილი';
      case 4:
        return 'მაისი';
      case 5:
        return 'ივნისი';
      case 6:
        return 'ივლისი';
      case 7:
        return 'აგვისტო';
      case 8:
        return 'სექტემბერი';
      case 9:
        return 'ოქტომბერი';
      case 10:
        return 'ნოემბერი';
      case 11:
        return 'დეკემბერი';
    }
  }

  public static subjectColor(color: number) {
    switch (color) {
      case 0:
        return '#96C8ED';
      case 1:
        return '#F6A2D2';
      case 2:
        return '#FAFF5C';
      case 3:
        return '#FF9999';
      case 4:
        return '#79D184';
      case 5:
        return '#FFBF70';
      case 6:
        return '#B5E477';
      case 7:
        return '#B492DD';
      case 8:
        return '#9DFBFB';
      case 9:
        return '#ebebeb';
      case 10:
        return '#f3da82';
      default:
        return '#fa837a';
    }
  }

}

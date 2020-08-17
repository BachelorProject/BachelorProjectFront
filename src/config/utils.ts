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

}

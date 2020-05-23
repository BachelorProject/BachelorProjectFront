export class Utils {

  public static numberToMonth(mon: number) {
    switch (mon) {
      case 1:
        return 'იანვარი';
      case 2:
        return 'თებერვალი';
      case 3:
        return 'მარტი';
      case 4:
        return 'აპრილი';
      case 5:
        return 'მაისი';
      case 6:
        return 'ივნისი';
      case 7:
        return 'ივლისი';
      case 8:
        return 'აგვისტო';
      case 9:
        return 'სექტემბერი';
      case 10:
        return 'ოქტომბერი';
      case 11:
        return 'ნოემბერი';
      case 12:
        return 'დეკემბერი';
    }
  }

}

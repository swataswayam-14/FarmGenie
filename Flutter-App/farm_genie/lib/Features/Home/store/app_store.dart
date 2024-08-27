import 'package:farm_genie/Features/Market%20Place/Store/market_place_store.dart';
import 'package:mobx/mobx.dart';
part 'app_store.g.dart';

class AppState = _AppStateStore with _$AppState;

abstract class _AppStateStore with Store {
  final MarketPlaceStore marketPlaceStore;
  
  
  _AppStateStore({required this.marketPlaceStore});
  @observable
  int bottomindex = 0;


  @action
  void setBottomIndex() {}
}

import 'package:mobx/mobx.dart';
part 'app_store.g.dart';
class AppState = _AppStore with _$AppState;

abstract class _AppStore with Store {
  @observable
  int currentScreenIndex = 0;

  
}

import 'package:mobx/mobx.dart';

abstract class AppStore with Store{
  @observable
  int bottomindex = 0;

  @action
  void setBottomIndex(){
    
  }
 }
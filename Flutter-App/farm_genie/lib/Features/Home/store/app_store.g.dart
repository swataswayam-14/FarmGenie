// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AppState on _AppStateStore, Store {
  late final _$bottomindexAtom =
      Atom(name: '_AppStateStore.bottomindex', context: context);

  @override
  int get bottomindex {
    _$bottomindexAtom.reportRead();
    return super.bottomindex;
  }

  @override
  set bottomindex(int value) {
    _$bottomindexAtom.reportWrite(value, super.bottomindex, () {
      super.bottomindex = value;
    });
  }

  late final _$_AppStateStoreActionController =
      ActionController(name: '_AppStateStore', context: context);

  @override
  void setBottomIndex() {
    final _$actionInfo = _$_AppStateStoreActionController.startAction(
        name: '_AppStateStore.setBottomIndex');
    try {
      return super.setBottomIndex();
    } finally {
      _$_AppStateStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
bottomindex: ${bottomindex}
    ''';
  }
}

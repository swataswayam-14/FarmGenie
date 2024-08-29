// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AppState on _AppStore, Store {
  late final _$currentScreenIndexAtom =
      Atom(name: '_AppStore.currentScreenIndex', context: context);

  @override
  int get currentScreenIndex {
    _$currentScreenIndexAtom.reportRead();
    return super.currentScreenIndex;
  }

  @override
  set currentScreenIndex(int value) {
    _$currentScreenIndexAtom.reportWrite(value, super.currentScreenIndex, () {
      super.currentScreenIndex = value;
    });
  }

  @override
  String toString() {
    return '''
currentScreenIndex: ${currentScreenIndex}
    ''';
  }
}

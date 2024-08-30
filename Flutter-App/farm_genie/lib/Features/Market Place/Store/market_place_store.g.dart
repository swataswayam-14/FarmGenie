// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'market_place_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$MarketPlaceStore on _MarketPlace, Store {
  late final _$isLoadingAtom =
      Atom(name: '_MarketPlace.isLoading', context: context);

  @override
  bool get isLoading {
    _$isLoadingAtom.reportRead();
    return super.isLoading;
  }

  @override
  set isLoading(bool value) {
    _$isLoadingAtom.reportWrite(value, super.isLoading, () {
      super.isLoading = value;
    });
  }

  late final _$isChatBotOpenAtom =
      Atom(name: '_MarketPlace.isChatBotOpen', context: context);

  @override
  bool get isChatBotOpen {
    _$isChatBotOpenAtom.reportRead();
    return super.isChatBotOpen;
  }

  @override
  set isChatBotOpen(bool value) {
    _$isChatBotOpenAtom.reportWrite(value, super.isChatBotOpen, () {
      super.isChatBotOpen = value;
    });
  }

  late final _$listAtom = Atom(name: '_MarketPlace.list', context: context);

  @override
  ObservableList<ProductModel> get list {
    _$listAtom.reportRead();
    return super.list;
  }

  @override
  set list(ObservableList<ProductModel> value) {
    _$listAtom.reportWrite(value, super.list, () {
      super.list = value;
    });
  }

  @override
  String toString() {
    return '''
isLoading: ${isLoading},
isChatBotOpen: ${isChatBotOpen},
list: ${list}
    ''';
  }
}

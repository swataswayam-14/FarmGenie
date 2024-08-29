import 'package:fg_community/Features/activity/screens/activity_screen.dart';
import 'package:fg_community/Features/communities/screens/communities_screen.dart';
import 'package:fg_community/Features/createThread/screens/create_theard_screen.dart';
import 'package:fg_community/Features/home/screens/home_screen.dart';
import 'package:fg_community/Features/profile/screens/profile_screen.dart';
import 'package:fg_community/Features/search/screens/search_screen.dart';
import 'package:flutter/material.dart';


enum AppScreen {
  homeScreen,
  searchScreen,
  activityScreen,
  threadScreen,
  communityScreen,
  profileScreen,
}

extension AppScreenEnumX on AppScreen {
  Widget getScreen() {
    switch (this) {
      case AppScreen.homeScreen:
      
        return HomeScreen();
      case AppScreen.searchScreen:
        return SearchScreen();
      case AppScreen.activityScreen:
        return ActivityScreen();
      case AppScreen.threadScreen:
        return CreateTheardScreen();
      case AppScreen.communityScreen:
        return CommunitiesScreen();
      case AppScreen.profileScreen:
        return ProfileScreen();
    }
  }
}

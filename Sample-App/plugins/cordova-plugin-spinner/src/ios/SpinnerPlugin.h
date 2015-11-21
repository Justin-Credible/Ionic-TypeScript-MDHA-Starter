//
//  SpinnerPlugin.h
//
//  Copyright (c) 2015 Justin Unterreiner. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "MBProgressHUD.h"

@interface SpinnerPlugin : CDVPlugin
- (void)activityStart:(CDVInvokedUrlCommand *)command;
- (void)activityStop:(CDVInvokedUrlCommand *)command;
@end
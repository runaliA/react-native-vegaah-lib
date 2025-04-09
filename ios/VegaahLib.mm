#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Applepay,NSObject)

RCT_EXTERN_METHOD(createApplePayToken:(NSString *)merchantIdentfier amount:(NSString *) amount label:(NSString *) label callback: (RCTResponseSenderBlock)callback)

@end

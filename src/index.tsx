
import {
  StyleSheet,
  View,  SafeAreaView,Text,Alert
} from 'react-native';
import { NativeModules, Platform } from 'react-native';


const { Applepay } = NativeModules;
// import CustomWebView from './CustomWebView';
import WebView from 'react-native-webview';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import DeviceInfo from 'react-native-device-info';


interface HostedPluginProps {
  data: string | null | undefined;
  onClose: (result: any) => void; // Callback prop to send the result back to the parent
}

const HostedPlugin: React.FC<HostedPluginProps>   = ({ data, onClose }) => {
  const [paymentResult, setPaymentResult] = useState<any>(null); // To store the result of the payment request
  const [loading, setLoading] = useState(true);// To manage loading state
  const [showWebView, setShowWebView] = useState(true);
  const [strpaymenturl, setStrPaymentUrl] = useState("")
 
  const reqparams: any = data;
  const requestdata: any = JSON.parse(reqparams);

const [publicIp,setpublicIp] = useState("");
const [ispublicipfetched,setIsPublicIpFetched] = useState(false);


useEffect(() => {
  const fetchPublicIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const result = await response.json();
      console.log("Public IP in own method:", result.ip);
      setpublicIp(result.ip);
      setIsPublicIpFetched(true);
    } catch (e) {
      console.log('Something went wrong while fetching the public IP');
    }
  };

  fetchPublicIp();
},[]); 

  useEffect(() => {
    if(ispublicipfetched)
    {
      console.log("Public IP in useEffect:", publicIp);
      fetchPayment();
    }
  }, [publicIp,ispublicipfetched]);




 // useEffect(() => {
    const fetchPayment = async () => {
      //const varcurrency = 'SAR';
      //const amount = '1';
      console.log("DATA " + data);
     
      console.log("In ELSE of Apple pay " + JSON.stringify(requestdata));

      const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount +
      "|" + requestdata.currency + "";
      const hash = CryptoJS.SHA256(txn_details).toString(CryptoJS.enc.Hex);
    console.log('SHA-256 Hash:', hash);
   // let devicejson ={};
    const appName = DeviceInfo.getSystemName();
    console.log("appName : "+appName);

    const validatePaymentRequest = (paymentRequest: any) => {
      console.log("In validatePaymentRequest" + JSON.stringify(paymentRequest ));
      if (!paymentRequest) {
        console.error("Payment request is null or undefined");
        return false;
      }
    
      else if (!paymentRequest.amount || paymentRequest.amount <= 0) {
        console.error("Invalid payment amount");
        return false;
      }
    
     else if (!paymentRequest.currency) {
        console.error("Currency is required");
        return false;
      }
      else if (!paymentRequest.paymentType)
{
  Alert.alert('Error', 'Payment Type is required');
  return false;
}    
      // Add more validations as needed
      return true;
    };

   
  
    const handlePayment = (paymentRequest: any) => {

      if (validatePaymentRequest(paymentRequest)) {
        // Proceed with payment processing
        console.log("Payment request is valid");
      } else {
        // Handle invalid payment request
        Alert.alert('Error', 'Payment Request is invalid');
        if(showWebView)
          {
        // Send the result back to the parent app
        onClose("Payment Request is invalid");
        // Hide WebView after sending result
        setShowWebView(false);
          }
      }
    };
  console.log("signature", hash);
  console.log("Public IP  method:", publicIp);
 // const json_devicedata = JSON.stringify(devicejson);
      const paymentRequest = {
        terminalId: requestdata.terminalId,
        paymentType: requestdata.action,
        merchantIp:publicIp || '0.0.0.0',
        password: requestdata.password,
        amount: requestdata.amount,
        signature: hash,
        customer: {
          "customerEmail": requestdata.email,
          "billingAddressStreet":requestdata.city,
          "billingAddressCity": requestdata.city,
          "billingAddressState": requestdata.state,
          "billingAddressPostalCode": requestdata.zipcode,
          "billingAddressCountry": requestdata.country
      },
        currency: requestdata.currency,
        customerIp: publicIp || '0.0.0.0',
        referenceId : requestdata.transactionId,
        applepayId: 'applepay',
        order: {
          orderId: requestdata.trackid,
          description: "Purchase of product XYZ"
        },
        country:requestdata.country,
        tokenization: {
        "cardToken": requestdata.cardtoken,
        "operation": requestdata.tokenizationType
    },
    "paymentInstrument": {
      "paymentMethod": "CCI"
  },
  
    additionalDetails: {
      'userData': requestdata.metadata
      
    },
    'deviceInfo' : {

      'pluginName': "React Native ",
      'pluginVersion': '3.0.3',
      'pluginPlatform': DeviceInfo.getDeviceType(),
      'deviceModel': DeviceInfo.getModel(),
      'devicePlatform': appName,
    }
      };

      handlePayment(paymentRequest);
      
      console.log("  REQUEST "+JSON.stringify(paymentRequest))
      let requrl = requestdata.requestUrl
      try {
        const response = await fetch(requrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentRequest)
        });
        const result = await response.json();
        console.log("RESPONSE", result);
        console.log("REQUEST", JSON.stringify(paymentRequest));
         setPaymentResult(result);
      } catch (e) {
        console.log('Something went wrong while sending the request');


        Alert.alert('Something went wrong while sending the request');
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

  //   fetchPayment();
  // }, [data]);

// Once we have the API result, call the onClose callback and hide the WebView
useEffect(() => {
  if (paymentResult) {
    const dataRequest = paymentResult
    console.log(" in useeffect " + dataRequest);
    if(dataRequest.responseCode == '001')
    {
      console.log("PAYMENT RESULT "+paymentResult)
      const linkUrl = dataRequest.paymentLink.linkUrl;
      const transactionId = dataRequest.transactionId;
      console.log(linkUrl+transactionId);
      setStrPaymentUrl(linkUrl+transactionId)
      console.log("Link URL:", linkUrl);              
      console.log("Transaction ID:", transactionId);
    }
    else
    {
      console.log("PAYMENT RESULT in else "+paymentResult)

      if(showWebView)
      {
    // Send the result back to the parent app
    onClose(JSON.stringify(paymentResult));
    // Hide WebView after sending result
    setShowWebView(false);
      }
    }
  }
}, [paymentResult, onClose]);

  if (loading) {
    return <SafeAreaView><View><Text>Loading...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.urlContainer}>
        
      </View>
     {showWebView && ( <View style={styles.btnContainer}>
        <WebView 

        originWhitelist={['*']} 
          source={{ uri: strpaymenturl }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
     
          style={{ flex: 1,height: '100%', width: '100%' }}
          mixedContentMode="always" 
          onLoadStart={() => console.log('WebView load started')}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
          onNavigationStateChange={(navState) => {
            
          //  setCurrentUrl(navState.url); // Update the URL as it changes
           // console.log("Navigated to:", navState.url); 
            if(navState.url.includes("?data"))
            {
              //console.log("in Data "+ navState.url)
            const urlParts = navState.url.split('?');
            let queryParams: { [key: string]: string } = {};
            if (urlParts.length > 1) {
              const urlString : any = urlParts[1];
              //console.log("STRING "+ urlString)
            
            // Split the query string by "&"
            
            const params = urlString.split("&");

            // Loop through each key-value pair
            if(params.length > 1)
              {
                  const respparam = params[0]
                      const respstr = respparam.split("=");
                      let strkey = respstr[0]
                      let strvalue = respstr[1]
                       console.log(strkey + " - "+strvalue);
                       queryParams['data'] = strvalue ?? ''
                       
              }

            // Access the "data" and "termId" values
            const data1 : any = queryParams["data"];
            const termId = queryParams["termId"];

            console.log("Data:", data1);   // Will print the value of 'data'
            console.log("Term ID:", termId);

           // const decodedString = base64Decode(data1);
           const decodedString = decodeURIComponent(data1);
            console.log('Decoded String:', decodedString);

              const secretKey = requestdata.merchantkey;
              console.log("Merchant Data "+decodedString)
              const result = decryptAES256ECB(decodedString, secretKey);
              console.log("FINAL RESPONSE " + result);
              if (result) {
                console.log('Decrypted Text:', result);
                if(showWebView)
                {
                // Send the result back to the parent app
                onClose(result);
                // Hide WebView after sending result
                setShowWebView(false);
                }
              } else {
                console.log('Failed to decrypt.');
              }
              }
            }  
          }}
        />
      </View>
    )}
    </SafeAreaView>
  );
};
const decryptAES256ECB = (ciphertext :  string , secretKey : any) => {
  try {
      // Decode the Base64 string
      //const decodedString = CryptoJS.enc.Base64.parse(ciphertext);
      //console.log(" iN ECB "+ ciphertext);
      //Alert.alert('iN ECB', ciphertext);
      // Create the decryption parameters
      const key = CryptoJS.enc.Hex.parse(secretKey);

      // Decrypt the ciphertext
      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });

    // Convert decrypted data to UTF-8
     const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);
    Alert.alert('Decryption TEXT', decryptedText);
    // Check if the decryption was successful
    if (!decryptedText) {
      throw new Error(
        'Decryption resulted in an empty string. Invalid key or data.'
      );
    }
    return decryptedText;
  } 
  catch (error :  any) 
  {
    console.error('Decryption Error:', error.message);
    Alert.alert('Decryption Error', error.message); // Show an alert on error
    return null;
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    flex: 1,
  },
  urlContainer: {
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
});

const ApplePayComponent: React.FC<HostedPluginProps> = ({ data, onClose }) => {
  useEffect(() => {

    //First create Applepay session

    const processApplePay = async () => {
      Alert.alert('Apple Pay Amount ', JSON.stringify(data));
      if (Platform.OS === 'android') {
        throw new Error('Apple Pay is not supported on Android devices');
      }
      Applepay.createApplePayToken("merchantIdentifier", String("amount"), "label", async (err: any , token : any) => {
        if (err) {
          Alert.alert('Error', `${err}`, [{
            text: 'ok',
            style: 'default'
          }]);
          onClose(err);
        }
        else {
          Alert.alert('Apple Pay Token', `${token}`, [{
            text: 'ok',
            style: 'default'
          }]);
          onClose(token); // Send the API response back to the parent
        }
      
       
      });
      // try {
      //   const requestData = JSON.parse(data || '{}');
      //   const response = await fetch('https://your-api-endpoint.com/applepay', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(requestData),
      //   });

      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }

      //   const result = await response.json();
      //   onClose(result); // Send the API response back to the parent
      // } catch (error) {
      //   console.error('Error processing Apple Pay:', error);
      //   Alert.alert('Error', 'Failed to process Apple Pay');
      //   onClose({ error: 'Failed to process Apple Pay' }); // Send the error back to the parent
     // }
    };

    processApplePay();
  }, [data, onClose]);

  return null; // No UI to render
};
export { HostedPlugin, ApplePayComponent };
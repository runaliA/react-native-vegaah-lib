
import {
  StyleSheet,
  View,  SafeAreaView,Text,Alert
} from 'react-native';


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
  //const [currentUrl, setCurrentUrl] = useState("");
 // const [reqHash , setreqHash ] = useState("")
  //console.log("DATA " + data);
  const reqparams: any = data;
  const requestdata: any = JSON.parse(reqparams);
  useEffect(() => {
    const fetchPayment = async () => {
      //const varcurrency = 'SAR';
      //const amount = '1';
      console.log("DATA " + data);
     
      console.log("In ELSE of Apple pay " + JSON.stringify(requestdata));

      const txn_details = "" + requestdata.trackid + "|" + requestdata.terminalId + "|" + requestdata.password + "|" + requestdata.merchantkey + "|" + requestdata.amount +
      "|" + requestdata.currency + "";
      const hash = CryptoJS.SHA256(txn_details).toString(CryptoJS.enc.Hex);
    console.log('SHA-256 Hash:', hash);
    let devicejson ={};
    let appName = DeviceInfo.getSystemName();
    console.log("appName : "+appName);
      devicejson = {
                             'pluginName': "React Native ",
                             'pluginVersion': '1.0.0',
                             'pluginPlatform': DeviceInfo.getDeviceType(),
                             'deviceModel': DeviceInfo.getModel(),
                             'devicePlatform': DeviceInfo.getSystemName(),
                             'deviceOSVersion': DeviceInfo.getSystemVersion(),
                   };

  console.log("signature", hash);
  const json_devicedata = JSON.stringify(devicejson);
      const paymentRequest = {
        terminalId: requestdata.terminalId,
        paymentType: requestdata.action,
        merchantIp: '10.10.10.10',
        password: requestdata.password,
        amount: requestdata.amount,
        signature: hash,
        customer: {
          "customerEmail": requestdata.email,
          "billingAddressStreet":"Ghatkopar",
          "billingAddressCity": requestdata.city,
          "billingAddressState": requestdata.state,
          "billingAddressPostalCode": requestdata.zipcode,
          "billingAddressCountry": requestdata.country
      },
        currency: requestdata.currency,
        customerIp: '10.10.10.10',
        referenceId : requestdata.transactionId,
        applepayId: 'applepay',
        order: {
          orderId: requestdata.trackid,
          description: "Purchase of product XYZ"
        },
        country:requestdata.country,
        tokenization: {
        "cardToken": "",
        "operation": requestdata.tokenizationType
    },
    additionalDetails: {
      'userData': requestdata.metadata
      
    },
    'deviceInfo' : json_devicedata
      };

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
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchPayment();
  }, [data]);

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
      console.log("Link URL:", linkUrl);               // Output: Link URL: http://10.10.11.66:7070/vegaahpayments/direct.htm?paymentId=
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
     
          style={{ flex: 1 }}
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

            // let data123 =
            // 'StWTroAjr/0PZYMM1bDoFn60i833Xws27bNws++fjZbbw+Yf/7xpF8HqA3t1BxqOoOD/HSYTvpxqrE59NPE1fB6E1lNo8GTaLX4x+u2YVrcH7VeQ0/jObUtAKI67YVXikCcp64K+Ys+EllpYuha8/nMeLEbGjWDLT+a7jVIBr9SRFZkwUNGi8US3dRKLi9SK5oSuIRw4axokM+XiEcQx0cVrDM41HBcDR/5hX61mWTtcr5tmrHLl7UMptcfhUZwFf/5Z/G8iB7Ju5d5oN35vMc0Lf/3GZxTHpx5vMqRWfRyx7dYO21UXneIjwH41l8xEcTDEOPIGnvXmpC+V13IoqbZH/PNl5CEMtRsX7Mmri+XaMKw6Ic3YiJPsme9BRHkfyb46Qu151rDwbYfcuSwvpKxEX/XTJ/6cWc1nid+AgqgKCdiC1viRZKhOHef7+nH0NBkleAMX8eOdBhJc2JYTHoS9mxkinLsewPtyNuiYVUkItZa8B6ZXh1FTMLVnUe/Rw28uEbuLsIGm6i5v7l4THQBa/7j+AZGuz9PIH68/uPIGFsKOLKQeY4jwiYNknw+YH8aiIUvsbxt3Q30LFJseOmAU9zTjHHVjFW//pIVTkwyfenpa8uNyuoUwNGBQlcrBoxNGHSLPYR/pGmz3qtvAxF/ZCdz1xEHIFEownpt1YXvbS/ROfCP4E5ZO5h57PB05pfAXNnGGW8GguBtXiiywMIUMZ0nV32H2EtbQnGN93k7kJEI9L1v61h+24V/XrPdmzSzu3VlHPStgY/2H0vM6/rSRPHdX9C65+0tNzOfVaLOVbC7UJwWVVVB8Oo06r5ti1Cm9nZzWwiFqT80c75Lh0I05BhyrEHCPyslMndaMBBGgd/N+DtTTDrjK+qmRRFbs';
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

export default HostedPlugin;
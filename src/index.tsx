
import {
  StyleSheet,
  View,  SafeAreaView,Text
} from 'react-native';
// import CustomWebView from './CustomWebView';
import WebView from 'react-native-webview';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import queryString from 'query-string';
interface HostedPluginProps {
  data: string | null | undefined;
  onClose: (result: any) => void; // Callback prop to send the result back to the parent
}

export const HostedPlugin: React.FC<HostedPluginProps>   = ({ data, onClose }) => {
  const [paymentResult, setPaymentResult] = useState<any>(null); // To store the result of the payment request
  const [loading, setLoading] = useState(true);// To manage loading state
  const [showWebView, setShowWebView] = useState(true);
  const [strpaymenturl, setStrPaymentUrl] = useState("")
  const [currentUrl, setCurrentUrl] = useState("");

  console.log("DATA " + data);
  useEffect(() => {
    const fetchPayment = async () => {
      //const varcurrency = 'SAR';
      //const amount = '1';
      console.log("DATA " + data);
      const reqparams: any = data;
      const requestdata: any = JSON.parse(reqparams);
      console.log("In ELSE of Apple pay " + JSON.stringify(requestdata));

      const paymentRequest = {
        terminalId: "TejasMPGS",
        paymentType: '1',
        merchantIp: '10.10.10.10',
        password: "Password@123",
        amount: "10.00",
        signature: "caa93ce1e3896342d156fdb9aacdc79b3ca2422e3c2ac6c82c60c9245ba70d48",
        customer: {
          "customerEmail": "tejas.kute@concertosoft.com",
          "billingAddressStreet":"Ghatkopar",
          "billingAddressCity": "MUMBAI",
          "billingAddressState": "MAHARASHTRA",
          "billingAddressPostalCode": "400075",
          "billingAddressCountry": "IN"
      },
        currency: 'SAR',
        customerIp: '10.10.10.10',
        applepayId: 'applepay',
        order: {
          orderId: "M11",
          description: "Purchase of product XYZ"
        }
      };

      try {
        const response = await fetch("http://10.10.11.66:7070/vegaahpayments/v2/payments/pay-request", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentRequest)
        });
        const result = await response.json();
        console.log("In Apple Pay Token", result);
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
    onClose(paymentResult);
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
        <Text>Current URL: {currentUrl}</Text>
      </View>
     {showWebView && ( <View style={styles.btnContainer}>
        <WebView
          source={{ uri: strpaymenturl }}
          style={{ flex: 1 }}
          onLoadStart={() => console.log('WebView load started')}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
          onNavigationStateChange={(navState) => {
            setCurrentUrl(navState.url); // Update the URL as it changes
            console.log("Navigated to:", navState.url); 
            const responseObject = queryString.parse(navState.url);
            let data1   =   JSON.stringify(responseObject['data'])
              const secretKey = CryptoJS.enc.Hex.parse("74daa0244042a97d7d2fa207a976eca03a9275f15f42ff080603ac6f2b93d337");
              console.log("Merchant Data "+data1)
                      try {
                  const decrypted = CryptoJS.AES.decrypt(data1, secretKey, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7,
                  });
                  //return decrypted.toString(CryptoJS.enc.Utf8);
                  console.error('Decryption Error:', decrypted.toString(CryptoJS.enc.Utf8));
                } catch (error) {
                  console.error('Decryption Error:', error);
                //  return null;
                } 
            
          }}
        />
      </View>
    )}
    </SafeAreaView>
  );
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


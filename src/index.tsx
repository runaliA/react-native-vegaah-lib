
import {
  StyleSheet,
  View,  SafeAreaView,Text
} from 'react-native';
// import CustomWebView from './CustomWebView';
import WebView from 'react-native-webview';
import React, { useEffect, useState } from 'react';



const HostedPlugin: React.FC<{ data: string | null | undefined }> = ({ data }) => {
  const [paymentResult, setPaymentResult] = useState<any>(null); // To store the result of the payment request
  const [loading, setLoading] = useState(true); // To manage loading state

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
        country: 'SA',
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
        console.log("PAYMENT RESULT "+paymentResult)
        setPaymentResult(result);
      } catch (e) {
        console.log('Something went wrong while sending the request');
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchPayment();
  }, [data]);

  if (loading) {
    return <SafeAreaView><View><Text>Loading...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <WebView
          source={{ uri: "https://blog.logrocket.com/" }}
          style={{ flex: 1 }}
          onLoadStart={() => console.log('WebView load started')}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
        />
      </View>
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
});

export default HostedPlugin;

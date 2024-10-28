
import {
  StyleSheet,
  View,  SafeAreaView
} from 'react-native';
// import CustomWebView from './CustomWebView';
import WebView from 'react-native-webview';



    export const HostedPlugin  : React.FC<{ data: string | null | undefined }> = ({ data }) => {
       
 
    const varcurrency = 'SAR';
    const amount = '1';
    //const url = "https://www.google.com";
    console.log("DATA  "+ data)
    const reqparams:any  = (data);
    const requestdata :any =JSON.parse(reqparams);
    console.log("In ELSE of Apple pay "+ JSON.stringify(requestdata));
    console.log(varcurrency);
    console.log('SA');
    console.log(amount);

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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  webViewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  btnContainer:
   {
    flex : 1,
    justifyContent : 'center',
    alignContent : 'center'
   }
});

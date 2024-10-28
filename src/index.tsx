
import {
  StyleSheet,
  View
} from 'react-native';
// import CustomWebView from './CustomWebView';
import WebView from 'react-native-webview';



    export const HostedPlugin   = ( props: {
      data: string | null | undefined   }) =>
   {
    const varcurrency = 'SAR';
    const amount = '1';
    const url = "https://www.google.com";
    const reqparams:any  = (props.data);
    const requestdata :any =JSON.parse(reqparams);
    console.log("In ELSE of Apple pay "+ JSON.stringify(requestdata));
    console.log(varcurrency);
    console.log('SA');
    console.log(amount);

    return (
     
        <View style={styles.loadingContainer}>
          <WebView source={{ uri: url }} style={styles.webview} />
        </View>
  
    );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});

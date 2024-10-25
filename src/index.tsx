
import {
  StyleSheet,
  Text,View
} from 'react-native';

//import WebView from 'react-native-webview';


    export const hostedplugin = ( props: {
      data: string | null | undefined   }) =>
   {
    const varcurrency = 'SAR';
    const amount = '1';
    const reqparams:any  = (props.data);
    const requestdata :any =JSON.parse(reqparams);
    console.log("In ELSE of Apple pay "+ JSON.stringify(requestdata));
    console.log(varcurrency);
    console.log('SA');
    console.log(amount);

  

    return (
      <View style={styles.loadingContainer}>
        <Text>Hello from MyComponent!</Text>
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

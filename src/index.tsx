



    export const v2plugin = ( props: {
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
}

/* eslint-disable prettier/prettier */
import React from 'react';
import { FloatingAction } from "react-native-floating-action";


const Fab = (props) => {
    return (
        <FloatingAction
            actions={actions}
            color={'#c45653'}
            position={'right'}
            visible={props.visible}
            overrideWithAction={false}
            showBackground={true}
            iconHeight={30}
            iconWidth={30}
            floatingIcon={require('../../icons/icons8-trash-64.png')}

            onPressItem={name => {
                console.log(`selected button: ${name}`);
                if(name==actions[1].name){
                    console.log(`selected button: ${name}`);
                    props.clearAll();
                }
                if(name==actions[0].name){
                    console.log(`selected button: ${name}`);
                    props.deleteAll();
                }
                
            }
            }
            onPressMain={name => {
                console.log(`selected button: ${name}`);
            }
            }

        />
    )
}

const actions = [
    {
        text: "Delete All",
        icon: require('../../icons/icons8-trash-48-1.png'),
        name: "btDeleteAll",
        position: 1,
        color: '#c45653'
    },
    {
        text: "Clear All",
        icon: require("../../icons/icons8-broom-256.png"),
        name: "btClearAll",
        position: 2
    },
];

export default Fab;
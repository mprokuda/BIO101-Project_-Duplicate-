import { useEffect, useState } from 'react';
import utilStyles from '../styles/utils.module.css';
//import styles from './SimTypes.module.css';
// FIXME: failed import of SimTypes css files
const styles = {}
import Image from 'next/image';


export function SimTypes({onChange}){
    
    // const [imageSRC, setimageSRC] = useState('../public/SelfContainedModel.png');

    // useEffect(() => {
        
    // }, [imageSRC])

    const handleChange = (event) => {
        let value = event.currentTarget.value;
        // switchImageSrc(value);
        onChange(value, "sim-types");
    }

    function switchImageSrc(current){
        if (current == "selfcontained"){
            setimageSRC('../public/SelfContainedModel.png');
        }else{
            setimageSRC('../public/SelfContainedModel.png');
        }
    }

    return(
        <div className={utilStyles["bubble-field"]}>
            <div>
                <input type="radio" name="type" value="selfcontained" onClick={handleChange} defaultChecked />
                <label htmlFor="contactChoice1">Self Contained</label>
            </div>

            <div>
                <input type="radio" name="type" value="variable" onClick={handleChange} />
                <label htmlFor="contactChoice1">Variable</label>
            </div>

            <div className={styles["sim-type-image"]}>
                {/* <image src='../public/SelfContainedModel.png'/> */}
            </div>
        </div>
    );
}
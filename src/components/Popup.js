import { Icon } from '@iconify/react';

export default function Popup(props) {
    const { background = "red", color = "white", message = "" } = props;

    return (
        <div style={{
            background,
            color,
            width:"100%",
            height: "60px",
            position: "absolute",
            bottom: 0,
            left: 0,
            display:"flex",
            justifyContent: "center",
            alignItems:"center",
        }}>
            <Icon icon="carbon:warning" />
            <p style={{marginLeft: "40px", textAlign:"center"}}>{message}</p>
        </div>
    )
}
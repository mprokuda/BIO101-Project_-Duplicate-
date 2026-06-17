import styles from './ChildNumber.module.css';

type ChildNumberHandler = (num_children: number) => void;

const MIN_CHILDREN: number = 1;
const MAX_CHILDREN: number = 4;

export function ChildNumber({ onChange }: { onChange: ChildNumberHandler }) {
    const handleChange = (event: any) => {
        const value: string = event.currentTarget.value;
        onChange(parseInt(value));
    }

    return (
        <div>
            <select className={styles.dropdown} id="child-num-select" onChange={handleChange}>
                {gen_children(MIN_CHILDREN, MAX_CHILDREN)}
            </select>
        </div>
    );
}

function gen_children(min: number, max: number) {
    const first = <option key={min} value={min}>{min}</option>;
    let dom_nodes = [first];

    if (Math.abs(min - max) == 0) {
        return dom_nodes;
    }

    for (let i = (min + 1); i <= max; i++) {
        const node = <option key={i} value={i}>{i}</option>;
        dom_nodes.push(node);
    }

    return dom_nodes;
}
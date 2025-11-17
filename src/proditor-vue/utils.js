import { Proportions } from "lucide-vue-next";

export function forceRender(instance, renderRefs = false) {
    instance.$forceUpdate();
    if (renderRefs) {
        let refs = [];
        Object.entries(instance.$refs).forEach(([_, value]) => {
            if(Array.isArray(value)) {
                refs = refs.concat(value);
            } else refs.push(value);
        })
        refs.forEach(ref => ref.$forceUpdate());
    }
}
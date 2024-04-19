export class Util {
    static pascalCase(s: string) {
        return s.replace(/\w+/g, function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();})
                .replace(/\s/g, "");
    }
}
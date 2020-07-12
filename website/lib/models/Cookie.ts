class Cookie {
    cookies: Map<String, String>;
    constructor() {
        this.cookies = new Map<String, String>();
    }

    parse(val: string) {
        let tempArr = val.split(";");
        for (let temp in tempArr) {
            tempArr[temp] = tempArr[temp].trim()
            let arr = tempArr[temp].split("=")
            this.cookies.set(arr[0], arr[1])
        }
    }
}

export default Cookie
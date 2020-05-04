
// taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript

const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

decode_bool = (value) => {
    if(value) {
        return "有"
    }
    if(value === false) {
        return "無"
    }
    return "未選択"
}

const table = new Map([
    ['email', (e) => ['メールアドレス', e]],
    ['name', (n) => ['医療機関名または個人名', n]],
    ['fusoku', (f) => ['医療物資の不足の有無', decode_bool(f)]],
    ['tarinaimono', (t) => ['医療物資の不足状況について', t]],
    ['ippannsoufu', (i) => ['一般の人から医療物資の寄付について', decode_bool(i)]],
    ['soufuhouhou', (s) => ['送付方法について', s]],
    ['message', (m) => ['その他伝えたいこと', m]],
])

const transform = async (dict) => {
    console.log(dict)
    let result = []
    for(let [k, v] of table) {
        if(k in dict) {
            result.push(v(dict[k]))
        }
    }
    for(let [k,v] of Object.entries(dict)) {
        console.log([k, v])
        if(!(table.has(k))) {
            result.push([k, v])
        }
    }
    return result
}

const validate = async (body) => {
    if(!('email' in body && body.email)) {
        let err = new Error('Missing email in request')
        err.status = 400
        throw err
    }
    const email = body.email;
    if(!re.test(email)) {
        let err = new Error('Email not valid')
        err.status = 400
        throw err
    }
    if(!('name' in body && body.name)) {
        let err = new Error('Missing name in request')
        err.status = 400
        throw err
    }
    const name = body.name
    const content = await transform(body)
    return {
        email: email,
        name: name,
        content: content.map(x => x.join(': '))
    }
}

module.exports = validate

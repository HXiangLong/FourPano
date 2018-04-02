/**
 * 键值对集合
 */
class HashTable {
    constructor() {
        this.size = 0;
        this.entry = new Object();
    }

    /**
     * 添加项
     * @param {*} key 唯一键
     * @param {*} value 对应值
     */
    add(key, value) {
        if (!this.containsKey(key)) {
            this.size++;
        }
        this.entry[key] = value;
    }

    /**
     * 根据key取值
     * @param {*} key 唯一键
     * return object
     */
    getValue(key) {
        return this.containsKey(key) ? this.entry[key] : null;
    }

    /**
     * 根据key删除一项
     * @param {*} key 
     */
    remove(key) {
        if (this.containsKey(key) && (delete this.entry[key])) {
            this.size--;
        }
    }

    /**
     * 是否包含某个key
     * @param {*} key 
     */
    containsKey(key) {
        return (key in this.entry);
    }

    /**
     * 是否包含某个值
     * @param {*} value 
     */
    containsValue(value) {
        for (var prop in this.entry) {
            if (this.entry[prop] == value) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取所有的值的数组
     */
    getValues() {
        var values = new Array();
        for (var prop in this.entry) {
            values.push(this.entry[prop]);
        }
        return values;
    }

    /**
     * 获取所有的key的数组
     */
    getKeys() {
        var keys = new Array();
        for (var prop in this.entry) {
            keys.push(prop);
        }
        return keys;
    }

    /**
     * 获取项总数
     */
    getSize() {
        return this.size;
    }

    /**
     * 清空哈希表
     */
    clear() {
        this.size = 0;
        this.entry = new Object();
    }

}

export default HashTable;
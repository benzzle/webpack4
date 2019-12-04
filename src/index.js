import _ from 'lodash';
import './style/index.css'
import './style/bg.scss'
function createElement(){
    let div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = _.join(['my', 'name', 'is', 'steven'], '');
    return div;
}
document.body.appendChild(createElement());

console.log(111)
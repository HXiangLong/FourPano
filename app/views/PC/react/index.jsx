/**初始化react,所有组件在这里集合 */

import React ,{Component}from 'react';
import './index.pcss'
import Header from './header/Header'

class Index extends Component {
    render() {
        return <div className='reactApp'>
            <Header />
        </div> 
    }
}

export default Index;
import '../styles/App.css';

import mdParser from '../utils/mdparser'
import privatepolicy from '../policy/privatepolicy'

function Policy({}){
    return(
        <div className="policy d-flex-r d-jc">
            <div className="markdown" dangerouslySetInnerHTML={{ __html: mdParser.render(privatepolicy) }} />
        </div>
    )
}

export default Policy
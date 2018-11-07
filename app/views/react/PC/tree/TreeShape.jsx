/**漫游类型选择界面 */
import React, { Component } from 'react';
import './TreeShape.css';

class TreeShape extends Component {
	constructor() {
		super();
	}

	render() {
		return this.props.off ? (
			<div className="TreeShapeBox">
				<ul>
					<li>第一组 中国共产党创建时期的纪律建设</li>
					<li>1、革命导师为共产党立规矩</li>
					<li>2、奠定纪律立党基石</li>
					<li>第二组 大革命时期党的纪律建设与中央监察委员会成立</li>
					<li>1、党内巡视和监督制度的萌芽</li>
					<li>2、第一个地方纪检机构成立</li>
					<li>3、修改党章强化党纪</li>
					<li>4、中共五大及其对纪律建设的贡献</li>
					<li>第三组 土地革命战争时期党的纪律建设</li>
					<li>1、八七会议与党的纪律建设</li>
					<li>2、中央审查委员会成立</li>
					<li>3、三湾改编与三大纪律六项注意</li>
					<li>4、古田会议与思想建党政治建军</li>
					<li>5、苏区干部好作风与反贪污浪费</li>
					<li>6、中央党务委员会成立</li>
					<li>7、长征中工农红军坚定信念与严守纪律</li>
					<li>8、白区工作者坚守信仰与严守纪律</li>
				</ul>
			</div>
		) : (
			''
		);
	}
}
export default TreeShape;

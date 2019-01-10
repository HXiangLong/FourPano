/**漫游类型选择界面 */
import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite } from '../../../../src/tool/SWInitializeInstance';
import { setCameraAngle } from '../../../../src/tool/SWTool';
import './TreeShape.css';
const external = require('../../../../src/tool/SWExternalConst.js');

class TreeShape extends Component {
	constructor() {
		super();
		this.panoIDArr = [
			[
				'W101-20180903000001',
				'W101-20180903000002',
				'W101-20180903000003',
				'W101-20180903000004',
				'W101-20180903000005',
				'W101-20180903000006',
				'W101-20180903000007',
				'W101-20180903000008',
				'W101-20180903000009',
				'W101-20180903000010',
				'W101-20180903000038',
				'W101-20180903000039'
			],
			[
				'W101-20180903000011',
				'W101-20180903000012',
				'W101-20180903000013',
				'W101-20180903000014',
				'W101-20180903000015',
				'W101-20180903000016',
				'W101-20180903000017',
				'W101-20180903000018',
				'W101-20180903000040',
				'W101-20180903000041',
				'W101-20180903000042'
			],
			[
				'W101-20180903000019',
				'W101-20180903000020',
				'W101-20180903000021',
				'W101-20180903000022',
				'W101-20180903000023',
				'W101-20180903000024',
				'W101-20180903000025',
				'W101-20180903000026',
				'W101-20180903000027',
				'W101-20180903000028',
				'W101-20180903000029',
				'W101-20180903000030',
				'W101-20180903000031',
				'W101-20180903000032',
				'W101-20180903000033',
				'W101-20180903000034',
				'W101-20180903000035',
				'W101-20180903000036',
				'W101-20180903000037',
				'W101-20180903000043',
				'W101-20180903000044',
				'W101-20180903000045'
			]
		];
	}

	treeJumpPano(obj) {
		let arr = obj.split('#');

		if (arr[0] == this.props.pid) {
			setCameraAngle(parseFloat(arr[1]), parseFloat(arr[2]), true);
		} else {
			constants.c_treeShapeJumpPano = true;

			jumpSite(arr[0]);

			constants.c_treeShapeJumpPanoStr = arr[1] + '#' + arr[2];
		}
	}

	render() {
		return external.server_json.features.directory ? this.props.off && constants.c_StationInfo ? (
			<div className="TreeShapeBox">
				<ul>
					<li
						className={this.panoIDArr[0].indexOf(this.props.pid) != -1 ? 'active' : ''}
						onClick={this.treeJumpPano.bind(this, 'W101-20180903000001#25#4')}
					>
						第一组 中国共产党创建时期的纪律建设
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000001#25#4')}>
						1、革命导师为共产党立规矩
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000038#158#-0.54')}>
						2、奠定纪律立党基石
					</li>
					<li
						className={this.panoIDArr[1].indexOf(this.props.pid) != -1 ? 'active' : ''}
						onClick={this.treeJumpPano.bind(this, 'W101-20180903000041#121#-0.16')}
					>
						第二组 大革命时期党的纪律建设与中央监察委员会成立
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000041#121#-0.16')}>
						1、党内巡视和监督制度的萌芽
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000041#121#-0.16')}>
						2、第一个地方纪检机构成立
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000041#335#-3.98')}>
						3、修改党章强化党纪
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000042#337#-3.29')}>
						4、中共五大及其对纪律建设的贡献
					</li>
					<li
						className={this.panoIDArr[2].indexOf(this.props.pid) != -1 ? 'active' : ''}
						onClick={this.treeJumpPano.bind(this, 'W101-20180903000019#197#-1.88')}
					>
						第三组 土地革命战争时期党的纪律建设
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000019#197#-1.88')}>
						1、八七会议与党的纪律建设
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000019#197#-1.88')}>
						2、中央审查委员会成立
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000019#147#-3.59')}>
						3、三湾改编与三大纪律六项注意
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000043#352#11.79')}>
						4、古田会议与思想建党政治建军
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000028#159#0.9')}>
						5、苏区干部好作风与反贪污浪费
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000036#69#2.84')}>
						6、中央党务委员会成立
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000037#69#4.62')}>
						7、长征中工农红军坚定信念与严守纪律
					</li>
					<li className="indentation" onClick={this.treeJumpPano.bind(this, 'W101-20180903000036#251#15.61')}>
						8、白区工作者坚守信仰与严守纪律
					</li>
				</ul>
			</div>
		) : (
			''
		) : (
			''
		);
	}
}
export default TreeShape;

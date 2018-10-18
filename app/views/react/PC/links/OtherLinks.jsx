/**友情链接界面 */
import React, { Component } from 'react';
import './OtherLinks.css';

const imgList = [
	require('../../../../commons/img/lianjie/bqhy.jpg'), //八七会议地址纪念馆
	require('../../../../commons/img/lianjie/eqhy.jpg'), //武汉“二七”纪念馆
	require('../../../../commons/img/lianjie/lmjj.jpg'), //毛泽东故居
	require('../../../../commons/img/lianjie/xsj.jpg'), //汉口新四军军部旧址纪念馆
	require('../../../../commons/img/lianjie/zyjs.jpg'), //武汉中央军事政治学校旧址
	require('../../../../commons/img/lianjie/zgyd.jpg'), //中共一大会议旧址
	require('../../../../commons/img/lianjie/zged.jpg'), //中共二大会议旧址
	require('../../../../commons/img/lianjie/zdsd.jpg'), //中共三大会议旧址
	require('../../../../commons/img/lianjie/zdsid.jpg'), //中共四大会议旧址
	require('../../../../commons/img/lianjie/zgwd.jpg'), //中共五大会议旧址
	require('../../../../commons/img/lianjie/zgld.jpg'), //中共六大会议旧址
	require('../../../../commons/img/lianjie/zgqd.jpg') //中共七大会议旧址
];

class OtherLinks extends Component {
	constructor() {
		super();
		this.links = [
			{
				name: '八七会议地址纪念馆',
				title: '八七会议会址纪念馆位于湖北省武汉市江岸区鄱阳街139号，依托八七会议旧址而建，是1920年英国人建造的一排西式公寓（时称“怡和新房”）的一部分。',
				href: 'http://www.192787.cn/'
			},
			{
				name: '武汉“二七”纪念馆',
				title: '二七纪念馆位于武汉市汉口，是为纪念1923年京汉铁路大罢工及“二七惨案”，在林祥谦、施洋等39位烈士牺牲的江岸地区修建的，1963年对外开放。',
				href:
					'https://baike.baidu.com/item/%E6%AD%A6%E6%B1%89%E4%BA%8C%E4%B8%83%E7%BA%AA%E5%BF%B5%E9%A6%86/5949325?fr=aladdin'
			},
			{
				name: '武汉毛泽东故居',
				title: '毛泽东同志旧居位于湖北省武汉市武昌都府堤41号，是栋晚清民居式建筑，坐东朝西，面积为436平方米，砖木结构，青砖灰瓦，传统的天井、堂屋加厢房组合成三进屋宇。',
				href: 'http://www.bytravel.cn/Landscape/21/wuhanmaozedongguju.html'
			},
			{
				name: '汉口新四军军部旧址纪念馆',
				title: '汉口新四军军部旧址纪念馆位于湖北省武汉市汉口江岸区芦沟桥路与胜利街的交汇处（原汉口大和街26号），占地面积500平方米，为一栋老式两层洋楼，钢筋水泥结构。',
				href:
					'https://baike.baidu.com/item/%E6%B1%89%E5%8F%A3%E6%96%B0%E5%9B%9B%E5%86%9B%E5%86%9B%E9%83%A8%E6%97%A7%E5%9D%80%E7%BA%AA%E5%BF%B5%E9%A6%86/20230257?'
			},
			{
				name: '武汉中央军事政治学校旧址',
				title: '武汉中央军事政治学校旧址位于武昌区解放路259号，即现湖北武昌实验小学院内，是原清“两湖书院”地域。',
				href:
					'https://baike.baidu.com/item/%E6%AD%A6%E6%B1%89%E4%B8%AD%E5%A4%AE%E5%86%9B%E4%BA%8B%E6%94%BF%E6%B2%BB%E5%AD%A6%E6%A0%A1%E6%97%A7%E5%9D%80'
			},
			{
				name: '中共一大会议旧址',
				title: '1921年7月23日至31日，中国共产党第一次全国代表大会于上海法租界贝勒路树德里3号召开。',
				href: 'http://www.zgyd1921.com/'
			},
			{
				name: '中共二大会议旧址',
				title: '1922年7月，中国共产党第二次全国代表大会在上海市静安区老成都北路7弄30号（原南成都路辅德里625号）召开。',
				href: 'https://baike.baidu.com/item/%E4%B8%AD%E5%85%B1%E4%BA%8C%E5%A4%A7%E4%BC%9A%E5%9D%80'
			},
			{
				name: '中共三大会议旧址',
				title: '1923年6月12日至20日，中国共产党第三次全国代表大会在广州市越秀区东山恤孤院路3号（原恤孤院路后街31号）召开。',
				href: 'https://baike.baidu.com/item/%E4%B8%89%E5%A4%A7%E4%BC%9A%E8%AE%AE%E7%BA%AA%E5%BF%B5%E9%A6%86'
			},
			{
				name: '中共四大会议旧址',
				title: '1925年1月11日至22日，中国共产党第四次全国代表大会在上海召开。于1987年确认上海虹口区东宝兴路254弄28支弄8号处的房子为四大会址。',
				href: 'http://sd1925.shhk.gov.cn/content/index.html'
			},
			{
				name: '中共五大会议旧址',
				title: '1927年4月27日至5月9日，中国共产党第五次全国代表大会会址纪念馆位于“中国第一红街”—武汉市武昌区都府堤20号召开。',
				href: 'http://www.whgmbwg.com/'
			},
			{
				name: '中共六大会议旧址',
				title: '1928年6月18日至7月11日，中国共产党第六次全国代表大会在莫斯科近郊兹维尼果罗德镇“银色别墅”秘密召开。',
				href: 'https://baike.baidu.com/item/%E4%B8%AD%E5%85%B1%E5%85%AD%E5%A4%A7%E4%BC%9A%E5%9D%80'
			},
			{
				name: '中共七大会议旧址',
				title: '1945年4月23日至6月11日，中国共产党第七次全国代表大会在延安杨家岭召开。',
				href:
					'https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%B8%83%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A/1010275?fromtitle=%E4%B8%83%E5%A4%A7&fromid=7720899'
			}
		];
	}

	closeOtherLinks() {
		this.props.closeOtherLinks();
	}

	showList() {
		let list = [];
		this.links.forEach((item, idx) => {
			list.push(
				<li key={`links${idx}`}>
					<a href={item.href} target="_blank" className="tooltip" title={item.title}>
						<i>
							<img src={imgList[idx]} />
						</i>
						<div className="info">
							<h3>{item.name}</h3>
							<p />
						</div>
					</a>
				</li>
			);
		});
		return list;
	}

	render() {
		return this.props.off ? (
			<div className="youqinglianjieBox">
				<div className="UIBG" onClick={this.closeOtherLinks.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeOtherLinks.bind(this)} />
				<ul>
                    {this.showList()}
                </ul>
			</div>
		) : (
			''
		);
	}
}

export default OtherLinks;

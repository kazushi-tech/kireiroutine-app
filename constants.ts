import { Frequency, ScheduleCategory } from './types';

/**
 * 画像パスの定義
 * 画像ファイルは public/images 配下に配置してください。
 * 
 * 必要な画像ファイル:
 * - bedroom-hero.jpg
 * - kitchen-hero.jpg
 * - bathroom-hero.jpg
 * - toilet-hero.jpg
 * - living-hero.jpg
 * - entrance-hero.jpg
 */
export const IMAGE_URLS: Record<string, string> = {
  bedroom: "/images/bedroom-hero.jpg",
  kitchen: "/images/kitchen-hero.jpg",
  bathroom: "/images/bathroom-hero.jpg",
  toilet: "/images/toilet-hero.jpg",
  living: "/images/living-hero.jpg",
  entrance: "/images/entrance-hero.jpg",

  // 既存の画像を使い回すエリア
  balcony: "/images/entrance-hero.jpg",         // ベランダ系 → 玄関画像を流用
  general: "/images/living-hero.jpg",           // その他・共通 → リビング画像を流用
};


export const CLEANING_DATA: ScheduleCategory[] = [
  {
    frequency: Frequency.Weekly,
    label: "週1 (毎週)",
    description: "メインの掃除ルール。迷ったらまずこのセクションだけ回せばOK。",
    sections: [
      {
        id: "weekly-bedroom",
        areaName: "寝室・ベッド周り",
        imageKey: "bedroom",
        step: 1,
        parallelTip: "シーツを洗濯機に入れたら、回っている間に次のエリアへ進む",
        waitTime: 30,
        waitAction: "洗濯中→次のエリアへ",
        tasks: [
          { id: "w-bed-1", text: "シーツ・枕カバーを洗濯して交換する" },
          { id: "w-bed-2", text: "ベッドまわりの床（ベッド下の手が届く範囲）を掃除機 → モップで拭き掃除" },
          { id: "w-bed-3", text: "ベッドサイドテーブル、ヘッドボード上のホコリをサッと拭き取る" },
        ],
        tools: ["洗濯洗剤", "洗濯ネット", "掃除機", "フロアモップ", "マイクロファイバークロス"]
      },
      {
        id: "weekly-kitchen",
        areaName: "キッチン",
        imageKey: "kitchen",
        step: 3,
        parallelTip: "排水口に洗剤を入れてつけ置き→その間にコンロ周りを拭く",
        waitTime: 5,
        waitAction: "つけ置き中→コンロへ",
        tasks: [
          { id: "w-kit-1", text: "キッチン排水口・シンクのぬめり除去（酸素系漂白剤や中性洗剤で）" },
          { id: "w-kit-2", text: "コンロまわり（ガスコンロ）の表面・つまみを中性洗剤で拭き掃除" },
          { id: "w-kit-3", text: "調理台・シンク周りの水はね・油はねを拭き取り" },
          { id: "w-kit-4", text: "電子レンジ・トースター・電気ケトルの外側・取っ手・スイッチ部を拭き掃除" },
          { id: "w-kit-5", text: "キッチン床を掃除機 → モップ" },
        ],
        tools: ["食器用中性洗剤", "酸素系漂白剤", "スポンジ", "マイクロファイバークロス", "アルコールスプレー", "ゴム手袋", "フロアモップ"]
      },
      {
        id: "weekly-bath",
        areaName: "浴室・洗面所",
        imageKey: "bathroom",
        step: 4,
        parallelTip: "鏡にクエン酸ラップをしたら、湿布中にトイレ掃除へ",
        waitTime: 10,
        waitAction: "湿布中→トイレへ",
        tasks: [
          { id: "w-bath-1", text: "浴室排水口のフタ・ヘアキャッチャーのゴミを捨てて軽く洗う" },
          { id: "w-bath-2", text: "浴室排水口を簡易分解洗浄し、ぬめりを落とす" },
          { id: "w-bath-3", text: "浴室、洗面台の鏡・蛇口の水垢をクエン酸スプレーでラップで湿布" },
        ],
        tools: ["風呂用中性洗剤", "スポンジ", "浴室用ブラシ", "クエン酸スプレー", "マイクロファイバークロス", "ゴム手袋"]
      },
      {
        id: "weekly-toilet",
        areaName: "トイレ",
        imageKey: "toilet",
        step: 5,
        parallelTip: "便器に洗剤を塗布したら、なじませ中に床・壁を拭く",
        waitTime: 3,
        waitAction: "なじませ中→床拭き",
        tasks: [
          { id: "w-toilet-1", text: "便器内をトイレ用洗剤＋ブラシでこする" },
          { id: "w-toilet-2", text: "便座・フタ・レバー・便器外側・床まわりをトイレ用お掃除シートで拭き掃除" },
          { id: "w-toilet-3", text: "トイレットペーパー・消臭スプレーなどの残量チェック" },
          { id: "w-toilet-4", text: "トイレマット・スリッパがあれば軽くはたいてホコリを落とす" },
        ],
        tools: ["トイレ用洗剤", "トイレブラシ", "使い捨てトイレクリーナーシート", "ゴム手袋"]
      },
      {
        id: "weekly-living",
        areaName: "リビング・ワークスペース",
        imageKey: "living",
        step: 2,
        parallelTip: "掃除機→モップ→キッチンへ移動しながら一筆書きで",
        tasks: [
          { id: "w-living-1", text: "部屋全体（リビング・キッチン・廊下含む）の床を掃除機がけ" },
          { id: "w-living-2", text: "床全体をフロアモップ（ウェットシートまたは固く絞った雑巾）で拭き掃除" },
          { id: "w-living-3", text: "テレビ台・棚・PCデスク・モニター周りのホコリ取り" },
          { id: "w-living-4", text: "リモコン・キーボード・マウス・スマホ周りをアルコールシートで拭き取り" },
        ],
        tools: ["掃除機", "フロアモップ", "ハンディモップ", "マイクロファイバークロス", "アルコール除菌シート"]
      },
      {
        id: "weekly-entrance",
        areaName: "玄関・廊下",
        imageKey: "entrance",
        step: 6,
        tasks: [
          { id: "w-ent-1", text: "玄関たたきをホウキで掃き、必要に応じて水拭き" },
          { id: "w-ent-2", text: "廊下の床を掃除機 → モップ" },
        ],
        tools: ["ほうき・ちりとり", "フロアモップ", "マイクロファイバークロス"]
      },
      {
        id: "weekly-other",
        areaName: "その他・共通",
        imageKey: "general",
        step: 7,
        tasks: [
          { id: "w-other-1", text: "室内のドアノブ／電気スイッチプレートをアルコールシートで拭き取り" },
          { id: "w-other-2", text: "よく触るリモコン・スマホケースをアルコールシートで拭き取り" },
        ],
        tools: ["アルコール除菌シート", "マイクロファイバークロス"]
      }
    ]
  },
  {
    frequency: Frequency.BiWeekly,
    label: "2週間に1回",
    description: "余裕のある週に「+α」で行うイメージ。汚れが気になってきた時に優先してチェック。",
    sections: [
      {
        id: "bi-kitchen",
        areaName: "キッチン",
        imageKey: "kitchen",
        step: 1,
        parallelTip: "コンロ受け皿をつけ置き→電子レンジの重曹水加熱→冷蔵庫整理を並行",
        waitTime: 15,
        waitAction: "つけ置き中→レンジへ",
        tasks: [
          { id: "bi-kit-1", text: "コンロの受け皿・汁受けプレートを外し、中性洗剤か重曹でつけ置き洗い" },
          { id: "bi-kit-2", text: "電子レンジ庫内のこびりつきを、重曹水をチンして蒸気でふやかしてから拭き取り" },
          { id: "bi-kit-3", text: "冷蔵庫内の「明らかに不要・賞味期限切れ」の食材を処分" },
        ],
        tools: ["食器用中性洗剤", "重曹", "スポンジ", "マイクロファイバークロス", "ゴム手袋"]
      },
      {
        id: "bi-bath",
        areaName: "浴室・洗面所",
        imageKey: "bathroom",
        step: 2,
        parallelTip: "浴室の壁・床をこすったら放置→その間に洗面台下収納を整理",
        tasks: [
          { id: "bi-bath-1", text: "浴室の壁・床全体をブラシでこすり、カビ予備軍を減らす" },
          { id: "bi-bath-2", text: "洗面台下収納の中身をざっと見直し、不要な箱やゴミを捨てる" },
        ],
        tools: ["風呂用洗剤", "ブラシ", "スポンジ", "マイクロファイバークロス"]
      },
      {
        id: "bi-toilet",
        areaName: "トイレ",
        imageKey: "toilet",
        step: 3,
        parallelTip: "壁に洗剤を塗布→なじませ中に玄関の靴箱換気を開始",
        waitTime: 3,
        waitAction: "なじませ中→玄関へ",
        tasks: [
          { id: "bi-toilet-1", text: "便器横〜壁の下部を中性洗剤をつけたクロスで拭き掃除（跳ね汚れ対策）" },
        ],
        tools: ["マイクロファイバークロス", "中性洗剤"]
      },
      {
        id: "bi-entrance",
        areaName: "玄関・廊下",
        imageKey: "entrance",
        step: 4,
        parallelTip: "靴箱の扱を開けて換気→換気中に靴の手入れを並行",
        tasks: [
          { id: "bi-ent-1", text: "靴箱の扱を開けて換気し、手前側の棚板をさっと拭く" },
          { id: "bi-ent-2", text: "よく履く靴の表面の汚れを、濡れ雑巾かシューケアシートで拭き取る" },
        ],
        tools: ["マイクロファイバークロス", "シューケアシート"]
      },
      {
        id: "bi-other",
        areaName: "その他・共通",
        imageKey: "general",
        step: 5,
        parallelTip: "掃除機のフィルター掃除→ゴミ箱拭きを同じタイミングで",
        tasks: [
          { id: "bi-other-1", text: "掃除機のダストボックス・紙パック・フィルターを掃除" },
          { id: "bi-other-2", text: "ゴミ箱の内側をアルコールシートで拭き、ニオイ対策" },
        ],
        tools: ["アルコール除菌シート", "ブラシ"]
      }
    ]
  },
  {
    frequency: Frequency.Monthly,
    label: "月1",
    description: "月末の「最終土曜日」などにまとめて実行する想定。リセット＆におい対策。",
    sections: [
      {
        id: "mo-bedroom",
        areaName: "寝室・ベッド周り",
        imageKey: "bedroom",
        step: 1,
        parallelTip: "寝具を洗濯機に入れる→回っている間にマットレス換気→キッチンへ",
        waitTime: 45,
        waitAction: "洗濯中→キッチンへ",
        tasks: [
          { id: "mo-bed-1", text: "ベッドパッドや毛布など「シーツ以外」の寝具を洗濯" },
          { id: "mo-bed-2", text: "マットレスを壁に立てかけるなどして、風を通す" },
        ],
        tools: ["洗濯洗剤", "大きめ洗濯ネット", "布団ばさみ"]
      },
      {
        id: "mo-kitchen",
        areaName: "キッチン",
        imageKey: "kitchen",
        step: 2,
        parallelTip: "冷蔵庫棚を洗って乾燥中→ケトルクエン酸沸騰→レンジフード拭きを並行",
        waitTime: 15,
        waitAction: "乾燥中→ケトルへ",
        tasks: [
          { id: "mo-kit-1", text: "冷蔵庫の棚・ドアポケットを外せる範囲で外し、洗剤で洗ってからよく乾かす" },
          { id: "mo-kit-2", text: "冷蔵庫内の在庫を見直し、賞味期限が近いもの／不要なものを整理" },
          { id: "mo-kit-3", text: "冷蔵庫パッキン部分をアルコールシートで拭き、カビ予防" },
          { id: "mo-kit-4", text: "レンジフード外側やコンロ周りの壁・タイルの油汚れを拭き掃除" },
          { id: "mo-kit-5", text: "電気ケトル内をクエン酸で湯沸かしし、カルキを落たす" },
        ],
        tools: ["食器用中性洗剤", "クエン酸", "マイクロファイバークロス", "キッチン用アルコール", "ゴム手袋"]
      },
      {
        id: "mo-bath",
        areaName: "浴室・洗面所",
        imageKey: "bathroom",
        step: 3,
        parallelTip: "洗濯槽クリーナー運転開始→運転中に洗面台排水口掃除へ",
        waitTime: 60,
        waitAction: "槽洗浄中→洗面台へ",
        tasks: [
          { id: "mo-bath-1", text: "洗濯槽クリーナーで「槽洗浄コース」を運転" },
          { id: "mo-bath-2", text: "洗濯機のゴムパッキン周り・フタの内側を拭き掃除" },
          { id: "mo-bath-3", text: "洗面台の排水口を、重曹＋クエン酸でしっかり掃除" },
        ],
        tools: ["洗濯槽クリーナー", "重曹", "クエン酸", "スポンジ", "マイクロファイバークロス"]
      },
      {
        id: "mo-toilet",
        areaName: "トイレ",
        imageKey: "toilet",
        step: 4,
        parallelTip: "タンク周りの掃除→玄関のゴミ箱丸洗いと並行で進行",
        tasks: [
          { id: "mo-toilet-1", text: "トイレタンク上の手洗い部分・フタ周辺を中性洗剤でしっかり拭き掃除" },
        ],
        tools: ["中性洗剤", "マイクロファイバークロス", "ハンディモップ"]
      },
      {
        id: "mo-entrance",
        areaName: "玄関・廊下",
        imageKey: "entrance",
        step: 5,
        parallelTip: "ゴミ箱を洗って乾燥中→玄関ドア拭きを並行",
        waitTime: 20,
        waitAction: "乾燥中→ドア拭き",
        tasks: [
          { id: "mo-ent-1", text: "ゴミ箱を丸洗いして、しっかり乾燥させる" },
          { id: "mo-ent-2", text: "玄関ドアの内側を中性洗剤で拭き、手あかを落とす" },
        ],
        tools: ["中性洗剤", "スポンジ", "ブラシ", "ゴミ袋", "マイクロファイバークロス"]
      }
    ]
  },
  {
    frequency: Frequency.Quarterly,
    label: "3ヶ月に1回",
    description: "カビ・油・ホコリを「根こそぎリセット」するタイミング。",
    sections: [
      {
        id: "qu-bedroom",
        areaName: "寝室・ベッド周り",
        imageKey: "bedroom",
        step: 1,
        parallelTip: "布団を天日干し開始→干している間にリビングのカーテン払いへ",
        waitTime: 60,
        waitAction: "天日干し中→リビングへ",
        tasks: [
          { id: "qu-bed-1", text: "マットレスの向きを90〜180度変える" },
          { id: "qu-bed-2", text: "掛け布団・枕を天日干しして、湿気とニオイをリセット" },
        ],
        tools: ["布団ばさみ", "物干しざお", "布団たたき"]
      },
      {
        id: "qu-kitchen",
        areaName: "キッチン",
        imageKey: "kitchen",
        step: 3,
        parallelTip: "レンジフードフィルターをつけ置き→冷蔵庫周りのホコリ取り→収納整理を並行",
        waitTime: 20,
        waitAction: "つけ置き中→冷蔵庫へ",
        tasks: [
          { id: "qu-kit-1", text: "レンジフードのフィルターを外し、ぬるま湯＋中性洗剤 or 重曹でつけ置き洗い" },
          { id: "qu-kit-2", text: "冷蔵庫の上・側面・背面のホコリを掃除機＋クロスで拭き取る" },
          { id: "qu-kit-3", text: "キッチン収納の中身を一度ざっと出し、底面を拭き掃除 → 不要なものを処分" },
        ],
        tools: ["食器用中性洗剤", "重曹", "スポンジ", "掃除機", "マイクロファイバークロス", "ゴム手袋"]
      },
      {
        id: "qu-bath",
        areaName: "浴室・洗面所",
        imageKey: "bathroom",
        step: 4,
        parallelTip: "カビ取り剤を塗布→待機中に洗濯機フィルター掃除へ",
        waitTime: 15,
        waitAction: "カビ取り待機中→洗濯機へ",
        tasks: [
          { id: "qu-bath-1", text: "浴室のゴムパッキン・タイル目地にカビ取り剤を塗り、時間をおいてから洗い流す" },
          { id: "qu-bath-2", text: "浴室ドアのレール・パッキン部分の黒ずみをブラシでこする" },
          { id: "qu-bath-3", text: "洗濯機の糸くずフィルター・排水フィルターを念入りに掃除" },
        ],
        tools: ["カビ取り剤", "ゴム手袋", "マスク", "ブラシ", "マイクロファイバークロス"]
      },
      {
        id: "qu-living",
        areaName: "リビング",
        imageKey: "living",
        step: 2,
        parallelTip: "カーテンホコリ払い→照明掃除→キッチンのフィルターつけ置きへ",
        tasks: [
          { id: "qu-liv-1", text: "カーテン全体をはたき・ハンディモップでホコリ払い" },
          { id: "qu-liv-2", text: "照明器具（シーリングライトなど）の表面のホコリをハンディモップで取る" },
        ],
        tools: ["ハンディモップ", "マイクロファイバークロス", "脚立"]
      },
      {
        id: "qu-balcony",
        areaName: "玄関・ベランダ",
        imageKey: "balcony",
        step: 5,
        parallelTip: "ベランダ掃き→サッシレール掃除→その他のエアコンへ",
        tasks: [
          { id: "qu-bal-1", text: "ベランダの床をほうきで掃き、泥や砂を掃除" },
          { id: "qu-bal-2", text: "玄関〜ベランダにかけて、サッシレールのホコリ・ゴミをブラシ＋掃除機で吸い取る" },
        ],
        tools: ["ほうき・ちりとり", "ブラシ", "掃除機", "マイクロファイバークロス"]
      },
      {
        id: "qu-other",
        areaName: "その他",
        imageKey: "general",
        step: 6,
        parallelTip: "エアコンフィルター水洗い→乾燥中に窓・網戸掃除を並行",
        waitTime: 30,
        waitAction: "フィルター乾燥中→窓へ",
        tasks: [
          { id: "qu-oth-1", text: "エアコンの前面カバーを外し、フィルターを掃除機＋水洗いして乾燥" },
          { id: "qu-oth-2", text: "窓ガラスの内側をガラスクリーナーで拭き掃除" },
          { id: "qu-oth-3", text: "網戸の表・裏を、軽く水拭き or 網戸用スポンジで掃除" },
        ],
        tools: ["掃除機", "エアコン用ブラシ", "ガラスクリーナー", "マイクロファイバークロス"]
      }
    ]
  },
  {
    frequency: Frequency.SemiAnnual,
    label: "半年に1回",
    description: "模様替え・断捨離も絡めた「中規模リセット」。",
    sections: [
      {
        id: "sa-bedroom",
        areaName: "寝室",
        imageKey: "bedroom",
        step: 1,
        parallelTip: "衣類仕分け→リビング収納整理→キッチンへと順番に進める",
        tasks: [
          { id: "sa-bed-1", text: "クローゼット内の衣類を見直し、「着ていない服」を仕分け" },
          { id: "sa-bed-2", text: "オフシーズンの寝具（毛布・厚手布団など）をクリーニング or 丸洗い" },
        ],
        tools: ["収納用圧縮袋", "ゴミ袋", "クリーニング用バッグ"]
      },
      {
        id: "sa-kitchen",
        areaName: "キッチン",
        imageKey: "kitchen",
        step: 3,
        parallelTip: "調理器具仕分け→調味料棚拭きを並行で進める",
        tasks: [
          { id: "sa-kit-1", text: "使用頻度の低い調理器具・食器を見直し、不要なものは処分" },
          { id: "sa-kit-2", text: "調味料棚全体を拭き掃除し、賞味期限切れの調味料を整理" },
        ],
        tools: ["マイクロファイバークロス", "中性洗剤", "ゴミ袋"]
      },
      {
        id: "sa-bath",
        areaName: "浴室・洗面所",
        imageKey: "bathroom",
        step: 4,
        parallelTip: "シャワーヘッドをクエン酸つけ置き→待機中に防水パン掃除へ",
        waitTime: 30,
        waitAction: "つけ置き中→防水パンへ",
        tasks: [
          { id: "sa-bath-1", text: "シャワーヘッド・ホース・カランなどをクエン酸につけ置きして、頑固な水垢を除去" },
          { id: "sa-bath-2", text: "洗濯機の防水パン・排水トラップを外せるところまで外し、汚れを掃除" },
        ],
        tools: ["クエン酸", "洗面器やバケツ", "ブラシ", "マイクロファイバークロス", "ゴム手袋"]
      },
      {
        id: "sa-toilet",
        areaName: "トイレ",
        imageKey: "toilet",
        step: 5,
        parallelTip: "トイレ床・壁掃除→玄関の靴箱全出しへ",
        tasks: [
          { id: "sa-toilet-1", text: "トイレの床全面・壁の下部を中性洗剤＋水拭き → から拭きでリセット" },
          { id: "sa-toilet-2", text: "タンク内に使用可能な洗浄剤があれば、取扱説明書に従って使用" },
        ],
        tools: ["中性洗剤", "マイクロファイバークロス", "バケツ", "ゴム手袋"]
      },
      {
        id: "sa-living",
        areaName: "リビング",
        imageKey: "living",
        step: 2,
        parallelTip: "収納棚整理→不用品仕分け→キッチン整理へ順番に",
        tasks: [
          { id: "sa-liv-1", text: "収納棚・引き出しを一度中身を出して、底面・側面を拭き掃除" },
          { id: "sa-liv-2", text: "「もう使わないもの」を仕分けして処分 or 売却候補に" },
        ],
        tools: ["掃除機", "マイクロファイバークロス", "ゴミ袋", "ダンボール"]
      },
      {
        id: "sa-entrance",
        areaName: "玄関・ベランダ",
        imageKey: "entrance",
        step: 6,
        parallelTip: "靴箱棚板拭き→ベランダ掃除→照明掃除へ",
        tasks: [
          { id: "sa-ent-1", text: "靴箱の中身を全出しして、棚板を中性洗剤で拭き掃除" },
          { id: "sa-ent-2", text: "ベランダ床・排水口をブラシでこすり洗い" },
        ],
        tools: ["中性洗剤", "ブラシ", "バケツ", "マイクロファイバークロス", "ゴミ袋"]
      },
      {
        id: "sa-other",
        areaName: "その他",
        imageKey: "general",
        step: 7,
        parallelTip: "照明カバー洗い→乾燥中にエアコン掃除へ",
        waitTime: 20,
        waitAction: "乾燥中→エアコンへ",
        tasks: [
          { id: "sa-oth-1", text: "照明器具のカバーを外し、水洗い or 拭き掃除してホコリと虫の死骸を除去" },
          { id: "sa-oth-2", text: "エアコンの吹き出し口・ルーバー周辺を、専用ブラシや綿棒でできる範囲で掃除" },
        ],
        tools: ["マイクロファイバークロス", "ドライバー", "エアコン用ブラシ", "綿棒"]
      }
    ]
  },
  {
    frequency: Frequency.Annual,
    label: "年1",
    description: "年末の大掃除シーズンなど、2〜3時間かけて一気にやるイメージ。",
    sections: [
      {
        id: "an-bedroom",
        areaName: "寝室",
        imageKey: "bedroom",
        step: 1,
        parallelTip: "カーテン洗濯開始→洗濯中にリビングの大型家具移動へ",
        waitTime: 60,
        waitAction: "洗濯中→リビングへ",
        tasks: [
          { id: "an-bed-1", text: "布団・マットレスの状態を確認し、ヘタりがひどければ買い替えを検討" },
          { id: "an-bed-2", text: "カーテン（レース・厚地両方）を洗濯し、レール・フックも拭き掃除" },
        ],
        tools: ["洗濯洗剤", "大型洗濯ネット", "マイクロファイバークロス"]
      },
      {
        id: "an-kitchen",
        areaName: "キッチン",
        imageKey: "kitchen",
        step: 3,
        parallelTip: "レンジフードつけ置き→冷蔵庫丸洗い→オーブン掃除を並行",
        waitTime: 30,
        waitAction: "つけ置き中→冷蔵庫へ",
        tasks: [
          { id: "an-kit-1", text: "レンジフード内部（ファン・内部パネルなど）を可能な範囲で分解洗浄 or 業者依頼" },
          { id: "an-kit-2", text: "冷蔵庫をほぼ空にして、棚・引き出しを丸洗いし、背面まで移動して床の汚れを掃除" },
          { id: "an-kit-3", text: "オーブンレンジ・トースターの庫内を重曹・クエン酸で徹底清掃" },
        ],
        tools: ["重曹", "クエン酸", "食器用中性洗剤", "スポンジ", "ブラシ", "ゴム手袋"]
      },
      {
        id: "an-bath",
        areaName: "浴室",
        imageKey: "bathroom",
        step: 4,
        parallelTip: "カビ取り剤塗布→待機中にトイレ大掃除へ",
        waitTime: 20,
        waitAction: "カビ取り待機中→トイレへ",
        tasks: [
          { id: "an-bath-1", text: "浴室全体（天井・壁・床・ドア・換気扇カバー）をカビ取り剤＋中性洗剤で徹底的に掃除" },
          { id: "an-bath-2", text: "洗濯機の分解クリーニングが必要なら、業者クリーニングを検討" },
        ],
        tools: ["カビ取り剤", "中性洗剤", "ブラシ", "スポンジ", "脚立", "ゴム手袋", "マスク"]
      },
      {
        id: "an-toilet",
        areaName: "トイレ",
        imageKey: "toilet",
        step: 5,
        parallelTip: "トイレ大掃除→玄関・ベランダ洗浄へ",
        tasks: [
          { id: "an-toilet-1", text: "トイレ全体（タンク内含む）を大掃除し、黄ばみ・黒ずみ・水垢を徹底除去" },
        ],
        tools: ["トイレ用強力洗剤", "カビ取り剤", "中性洗剤", "ブラシ", "手袋", "マスク"]
      },
      {
        id: "an-living",
        areaName: "リビング",
        imageKey: "living",
        step: 2,
        parallelTip: "大型家具移動→壁掃除→総仕分けを順番に",
        tasks: [
          { id: "an-liv-1", text: "大型家具・家電を動かし、裏側・下のホコリを掃除" },
          { id: "an-liv-2", text: "壁の黒ずみ・手あかが気になる箇所を、メラミンスポンジなどでやさしくこすってリセット" },
          { id: "an-liv-3", text: "1年を通して増えた書類・ガジェット類の「総仕分け」" },
        ],
        tools: ["掃除機", "メラミンスポンジ", "ハンディモップ", "ゴミ袋", "ダンボール"]
      },
      {
        id: "an-entrance",
        areaName: "玄関・ベランダ",
        imageKey: "balcony",
        step: 6,
        parallelTip: "玄関ドア洗浄→ベランダ水洗い→不用品整理へ",
        tasks: [
          { id: "an-ent-1", text: "玄関ドアの外側・ポストをまとめて洗浄" },
          { id: "an-ent-2", text: "ベランダ全体を水洗い" },
        ],
        tools: ["中性洗剤", "ブラシ", "バケツ", "ホース", "高圧洗浄機"]
      },
      {
        id: "an-other",
        areaName: "その他",
        imageKey: "general",
        step: 7,
        parallelTip: "エアコン業者依頼は事前予約→不用品整理を並行で進める",
        tasks: [
          { id: "an-oth-1", text: "エアコン内部クリーニングを業者に依頼" },
          { id: "an-oth-2", text: "1年分の不要品を洗い出し、粗大ゴミ回収やフリマアプリで処分" },
        ],
        tools: ["ゴミ袋", "粗大ゴミ用シール", "軍手", "電池"]
      }
    ]
  }
];

export type FrequencyId = Frequency;

export const FREQUENCY_SUMMARY_META: Record<
  Frequency,
  {
    label: string;
    shortDescription: string;
    examples: string;
  }
> = {
  [Frequency.Weekly]: {
    label: '週1（毎週）',
    shortDescription: 'ベッド・キッチン・トイレなど、生活の土台になる“メイン掃除”',
    examples: '例：ベッド周り、キッチン台、トイレ床 など',
  },
  [Frequency.BiWeekly]: {
    label: '2週に1回',
    shortDescription: '排水口や換気扇など、ちょっと重めで忘れがちな“中ボス掃除”',
    examples: '例：お風呂・キッチンの排水口、レンジフード表面 など',
  },
  [Frequency.Monthly]: {
    label: '月1',
    shortDescription: '床拭きや窓まわりなど、少し気合いがいる“リセット掃除”',
    examples: '例：床の水拭き、窓のサッシ、冷蔵庫内の拭き掃除 など',
  },
  [Frequency.Quarterly]: {
    label: '3ヶ月に1回',
    shortDescription: 'フィルター系や見えないところの“裏ボス掃除”',
    examples: '例：エアコンフィルター、ベッド下のほこり など',
  },
  [Frequency.SemiAnnual]: {
    label: '半年に1回',
    shortDescription: '大物家電や収納の“ガッツリ入れ替え掃除”',
    examples: '例：クローゼットの中身整理、キッチン収納の全部出し など',
  },
  [Frequency.Annual]: {
    label: '年1',
    shortDescription: '年末大掃除クラスの“総力戦掃除”',
    examples: '例：ベランダ全体、換気扇の分解掃除 など',
  },
};

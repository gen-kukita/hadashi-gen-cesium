        // 1) Viewer 作成（現代ベース地図は Cesium のデフォルト）
        const viewer = new Cesium.Viewer("cesiumContainer", {
          timeline: false,
          animation: false,
          geocoder: false,
          homeButton: true,
          sceneModePicker: true,
          baseLayerPicker: true,
          navigationHelpButton: true,
          infoBox: true,
          selectionIndicator: true
        });


        // === 爆心地（島病院上空付近）: 正確座標（まずはこれを基準点にする） ===
      const hypocenterLon = 132.4536;
      const hypocenterLat = 34.3955;
      const hypocenter = Cesium.Cartesian3.fromDegrees(hypocenterLon, hypocenterLat);

// 2) 初期表示：日本側を正面にした地球全体
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    135.0,
    35.0,
    20000000
  )
});
// 3) GSI 1945-1950 空中写真（ort_USA10）
const gsi1945 = new Cesium.UrlTemplateImageryProvider({
  url: "https://cyberjapandata.gsi.go.jp/xyz/ort_USA10/{z}/{x}/{y}.png",
  maximumLevel: 18,
  credit: "GSI Japan"
});

// 4) レイヤー追加（最初は非表示）
const gsiLayer = viewer.imageryLayers.addImageryProvider(gsi1945);
gsiLayer.show = false;
gsiLayer.alpha = 0.7;
// ========================================
// 1940 広島古地図
// ========================================

// ========================================
// 1940 広島古地図
// ========================================

const oldMapRectangle = Cesium.Rectangle.fromDegrees(
  132.39241424150222, // WEST
  34.34628340616473,  // SOUTH
  132.52759040266358, // EAST
  34.426772405143225  // NORTH
);

const oldMapImage = new Image();

oldMapImage.onload = () => {
  const oldMap1940 = new Cesium.SingleTileImageryProvider({
    url: "assets/hiroshima_1940_web.jpg",
    tileWidth: oldMapImage.width,
    tileHeight: oldMapImage.height,
    rectangle: oldMapRectangle
  });

  // Cesiumの画像先読みを迂回し、
  // ブラウザが読み込んだ画像を渡す
  oldMap1940._image = oldMapImage;

 const oldMap1940Layer =
  viewer.imageryLayers.addImageryProvider(oldMap1940);

// 被爆前のSceneでは、古地図を読みやすく表示
oldMap1940Layer.alpha = 0.85;
oldMap1940Layer.show = true;

viewer.imageryLayers.raiseToTop(oldMap1940Layer);

// 古地図の透明度スライダー
const oldMapOpacitySlider =
  document.getElementById("oldMapOpacitySlider");

oldMapOpacitySlider.oninput = (e) => {
  oldMap1940Layer.alpha = parseFloat(e.target.value);
};

// 古地図ON/OFFボタン
const toggle1940Btn =
  document.getElementById("toggle1940");

toggle1940Btn.onclick = () => {
  oldMap1940Layer.show = !oldMap1940Layer.show;

  toggle1940Btn.textContent =
    oldMap1940Layer.show
      ? "1940 古地図 OFF"
      : "1940 古地図 ON";
};

toggle1940Btn.onclick = () => {
  oldMap1940Layer.show = !oldMap1940Layer.show;

  toggle1940Btn.textContent =
    oldMap1940Layer.show
      ? "1940 古地図 OFF"
      : "1940 古地図 ON";
};
  console.log(
    "✅ 1940 historical map loaded via browser Image",
    oldMapImage.width,
    oldMapImage.height
  );
};

oldMapImage.onerror = (error) => {
  console.error("❌ 1940 browser Image FAILED:", error);
};

oldMapImage.src = "assets/hiroshima_1940_web.jpg";

        // 5) UI: ON/OFF
        const toggleBtn = document.getElementById("toggle1945");
        toggleBtn.onclick = () => {
          gsiLayer.show = !gsiLayer.show;
          toggleBtn.textContent = gsiLayer.show ? "1945 航空写真 OFF" : "1945 航空写真 ON";
        };

        // 6) UI: 透過度
        const slider = document.getElementById("opacitySlider");
        slider.oninput = (e) => {
          gsiLayer.alpha = parseFloat(e.target.value);
        };

        // 7) UI: 広島へ飛ぶ
        document.getElementById("flyToHiroshima").onclick = () => {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(132.455, 34.395, 8000),
            duration: 1.2
          });
        };

        // 追加：1地点だけ説明ポイント
        const basePoint = viewer.entities.add({
          name: "爆心地",
          position: hypocenter,
          point: {
            pixelSize: 12,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
          },
          label: {
            text: "1945.8.6",
            font: "14px sans-serif",
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20)
          },
          description: `
          <h3>1945年8月6日</h3>
          <p>ここを基準点として物語空間を再構築する。</p>

          <hr />

          
        `
              });

        // 最初から右上の説明を出す（選択状態にする）
       // viewer.selectedEntity = basePoint;
      // --- 被害圏の目安（円）: 500m / 1000m ---
      viewer.entities.add({
        name: "500m圏",
        position: hypocenter,
        ellipse: {
          semiMajorAxis: 500.0,
          semiMinorAxis: 500.0,
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.15),
          outline: true,
          outlineColor: Cesium.Color.RED
        }
      });

      viewer.entities.add({
        name: "1000m圏",
        position: hypocenter,
        ellipse: {
          semiMajorAxis: 1000.0,
          semiMinorAxis: 1000.0,
          height: 0,
          material: Cesium.Color.ORANGE.withAlpha(0.10),
          outline: true,
          outlineColor: Cesium.Color.ORANGE
        }
      });

        // そこへ寄せる（必要なら）
/*
        viewer.flyTo(basePoint, { duration: 1.5 });
  viewer.entities.add({
    name: "TEST TRIANGLE",

    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
            132.445090, 34.387944,
            132.446036, 34.387597,
            132.445258, 34.386435
        ]),
        material: Cesium.Color.BLUE.withAlpha(0.4),
        outline: true,
        outlineColor: Cesium.Color.YELLOW
    }
});
*/
        // --- 神山国民学校（現在の神崎小学校） ---
viewer.entities.add({
  name: "神山国民学校",

  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      132.444362, 34.386809,  // F
      132.445090, 34.387944,  // A
      132.446036, 34.387597,  // B
      132.446069, 34.386403,  // C
      132.445543, 34.386374,  // D
      132.445258, 34.386435   // E
    ]),
    material: Cesium.Color.BLUE.withAlpha(0.35),
    outline: true,
    outlineColor: Cesium.Color.YELLOW
  }
});
  /*
        viewer.entities.add({
            name: "ゲンの移動ルート（仮）",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    132.4553, 34.3955,  // 家（仮）
                    132.4580, 34.3962,  // 学校（仮）
                    132.4530, 34.3920   // 爆心地（仮）
                ]),
                width: 4,
                material: Cesium.Color.YELLOW
            }
        });
  */
      // ✅ クリックでシアン点＋lon/lat を出す（一本化・安全版）
      // ✅ クリックで「候補点を1個だけ更新」＋「爆心地から距離(m)」表示
      console.log("✅ single draft pin handler installed");

      // 1) 1個だけの仮マーカー（最初は爆心地に置く）
      const draftPin = viewer.entities.add({
        name: "候補地点（Draft）",
        position: hypocenter,
        point: {
          pixelSize: 10,
          color: Cesium.Color.CYAN,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
          text: "Draft",
          font: "14px sans-serif",
          pixelOffset: new Cesium.Cartesian2(12, -12),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.6)
        }
      });

      // 2) クリックハンドラは1本だけ
      const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      clickHandler.setInputAction((movement) => {
        let cartesian = null;

        // まずは3D上のピック（地形・3D上）
        if (viewer.scene.pickPositionSupported) {
          cartesian = viewer.scene.pickPosition(movement.position);
        }

        // ダメなら楕円体に投影（保険）
        if (!Cesium.defined(cartesian)) {
          cartesian = viewer.camera.pickEllipsoid(
            movement.position,
            viewer.scene.globe.ellipsoid
          );
        }
        if (!Cesium.defined(cartesian)) return;

        // lon/lat
        const carto = Cesium.Cartographic.fromCartesian(cartesian);
        const lon = Cesium.Math.toDegrees(carto.longitude);
        const lat = Cesium.Math.toDegrees(carto.latitude);

        // 爆心地からの距離（m）
        const distM = Cesium.Cartesian3.distance(hypocenter, cartesian);

        // ✅ 1点だけ更新（増やさない）
        draftPin.position = cartesian;
        draftPin.label.text = `Draft\n${lon.toFixed(5)}, ${lat.toFixed(5)}\n${distM.toFixed(1)} m`;

        console.log(
          `Draft lon/lat: ${lon.toFixed(6)}, ${lat.toFixed(6)} | dist: ${distM.toFixed(2)} m`
        );
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
/*       // --- はだしのゲン：Scene pins（まず5地点） ---
  const scenes = [
  {
    id: "gen_manga_001",
    title: "舟入本町　ゲンの生家",
    lon: 132.4437944,
    lat: 34.3854199,
    description: "ゲンが広島市の舟入本町で暮らしていた場所。物語の出発点。"
  },
  {
    id: "gen_manga_008",
    title: "学校へ向かう朝",
    lon: 132.4430,
    lat: 34.3880,
    description: "1945年8月6日、ゲンは神山国民学校へ向かう。座標は仮置き。"
  },
  {
    id: "gen_manga_009",
  title: "学校の塀の下で被爆★★★★★", 
     lon: 132.44470,
     lat: 34.38726,
  description: "神山国民学校正門付近。叔母に呼び止められ、塀の下で被爆する。"
  },
  {
    id: "gen_manga_011",
    title: "焼け跡の家族／生家周辺",
    lon: 132.4415,
    lat: 34.3860,
    description: "ゲンは家族のいる生家周辺へ戻る。"
  },
  {
    id: "gen_manga_012",
    title: "江波のバイト",
    lon: 132.443,
    lat: 34.371,
    description: "戦後、ゲンが生活費のため江波で働き始める。"
  }
  ];
 */

  const locations = [
  {
    id: "S01",
    title: "爆心地",
    lat: 34.3955,
    lon: 132.4536,
    source: "史実",
    confidence: "High"
  },
  {
    id: "S02",
    title: "舟入本町 生家",
    lat: 34.3854199,
    lon: 132.4437944,
    source: "漫画・自伝",
    confidence: "Estimated"
  },
 {
  id: "S03",
  title: "神山国民学校（漫画）／神崎国民学校（実話）校舎位置（推定）",
  lat: 34.38653,
  lon: 132.44404,
  source: "漫画・自伝・古地図との照合",
  confidence: "Estimated"
},
  {
  id: "S04",
  title: "神山国民学校 被爆地点（正門脇コンクリート塀・位置推定）",
  lat: 34.386763,
  lon: 132.443796,
  source: "漫画／旧神崎国民学校をモデルとした推定配置",
  confidence: "Estimated"
},
{
  id: "S05",
  title: "舟入川口町 電停 私道（避難場所）",
  lat: 34.38043,
  lon: 132.43975,
  source: "漫画・自伝",
  confidence: "Medium"
},
{
  id: "S06",
  title: "似島検疫所",
  lat: 34.311738,
  lon: 132.44686,
  source: "漫画",
  confidence: "Medium"
},
{
  id: "S07",
  title: "江波親戚宅",
  lat: 34.378945,
  lon: 132.435773,
  source: "漫画・自伝",
  confidence: "Estimated"
},
{
  id: "S08",
  title: "江波バイト先",
  lat: 34.377317,
  lon: 132.431697,
  source: "漫画",
  confidence: "Estimated"
},
{
  id: "S09",
  title: "呉海軍軍需工場（旧呉海軍工廠）",
  lat: 34.232049,
  lon: 132.553258,
  source: "漫画・自伝",
  confidence: "Medium"
},
{
  id: "S10",
  title: "昭の学童疎開先（候補地域：山県郡吉坂村吉木）",
  lat: 34.621812,
  lon: 132.415227,
  source: "漫画・自伝・史料",
  confidence: "Estimated"
},
{
  id: "S11",
  title: "西警察署（1945年・現 広島県民文化センター付近）",
  lat: 34.3945202,
  lon: 132.453617,
  source: "漫画・史実",
  confidence: "High"
},
{
  id: "S12",
  title: "江波射撃場・江波漁師町（現・舟入南～江波東）",
  lat: 34.373025,
  lon: 132.435336,
  source: "自伝",
  confidence: "Medium"
},
{
  id: "S13",
  title: "旧広島護国神社（招魂祭）",
  lat: 34.39607,
  lon: 132.45472,
  source: "自伝＋史料",
  confidence: "High"
},
{
  id: "S14",
  title: "厳島神社 大鳥居",
  lat: 34.2973,
  lon: 132.3182,
  source: "自伝",
  confidence: "High"
},
{
  id: "S15",
  title: "米兵捕虜（中国憲兵隊司令部）／原爆犠牲米軍人慰霊銘板",
  lat: 34.395131,
  lon: 132.4572238,
  source: "漫画",
  confidence: "High"
},
{
  id: "S17",
  title: "元川小学校（モデル推定：現・本川小学校）",
  lat: 34.39625,
  lon: 132.45075,
  source: "漫画・史料",
  confidence: "Estimated"
},
// ---------- Area ----------
{
  id: "A02",
  title: "町内（舟入本町周辺）",
  lat: 34.385268,
  lon: 132.443294,
  source: "漫画",
  confidence: "Approximate"
},

// ---------- FirePump ----------
{
  id: "P01",
  title: "防火ポンプ①",
  lat: 34.38756,
  lon: 132.44386,
  source: "自伝",
  confidence: "Estimated"
},
{
  id: "P02",
  title: "防火ポンプ②",
  lat: 34.38684,
  lon: 132.44331,
  source: "自伝",
  confidence: "Estimated"
},
{
  id: "P03",
  title: "防火ポンプ③",
  lat: 34.38602,
  lon: 132.44279,
  source: "自伝",
  confidence: "Estimated"
},
{
  id: "P04",
  title: "防火ポンプ④",
  lat: 34.38541,
  lon: 132.44242,
  source: "自伝",
  confidence: "Estimated"
},
{
  id: "P05",
  title: "防火ポンプ⑤",
  lat: 34.38546,
  lon: 132.44186,
  source: "自伝",
  confidence: "Estimated"
},

// ---------- Memory ----------
{
  id: "M01",
  title: "生家へ戻ろうとした地点（炎で進めず）",
  lat: 34.3859,
  lon: 132.44275,
  source: "自伝",
  confidence: "Estimated"
},
{
  id: "M02",
  title: "家族救出を試みた場所（漫画）",
  lat: 34.3852919,
  lon: 132.4404367,
  source: "漫画",
  confidence: ""
},
{
  id: "M04",
  title: "母との再会（舟入川口町電停前）",
  lat: 34.38043,
  lon: 132.43975,
  source: "自伝",
  confidence: "High"
},
{
  id: "M05",
  title: "被爆した米兵捕虜への投石（相生橋東詰）",
  lat: 34.3965,
  lon: 132.453172,
source: "漫画・自伝",
  confidence: "Estimated"
},
{
  id: "N01",
  title: "ABCC／放射線影響研究所（比治山）",
  lat: 34.3823321,
  lon: 132.4706021,
  source: "漫画・自伝・史実",
  confidence: "High"
}
];
// ========================================
// Manga Timeline
// ========================================

const mangaTimeline = [
  "S02",
  "S09",
  "A02",
  "S03",
  "S10",
  "S02",
  "S11",
  "S02",
  "S04",
  "P03",
  "S02",
  "S05",
  "A01",
  "S06",
  "S05",
  "S05",
  "A03",
  "S02",
  "S07",
  "S12",
"S17", // Scene 21 野村道子
"S16", // Scene 22 友子の死・位置未特定
"M05"  // Scene 23 原爆犠牲となった米兵捕虜
];
const mangaStories = [

  {
    titleJa: "舟入本町　ゲンの生家",
    titleEn: "Funairi-honmachi — Gen's Home",
    descriptionJa: "1945年春。ゲンは家族と広島・舟入本町で暮らしていた。父・大吉は下駄の塗装を仕事にしていた。",
    descriptionEn: "In the spring of 1945, Gen lived with his family in Funairi-honmachi, Hiroshima. His father, Daikichi, made a living painting wooden geta sandals."
  },

  {
    titleJa: "呉の海軍軍需工場",
    titleEn: "Kure Naval Arsenal",
    descriptionJa: "長兄・浩二は学徒動員され、呉の海軍軍需工場で軍艦製造の仕事に駆り出されていた。",
    descriptionEn: "Gen's eldest brother, Koji, was mobilized as a student and assigned to work in shipbuilding at the Kure Naval Arsenal."
  },

  {
    titleJa: "町内の竹やり訓練",
    titleEn: "Bamboo-Spear Drills in the Neighborhood",
    descriptionJa: "町内では「撃滅鬼畜米英」を掲げた竹やり訓練が行われる。父・大吉はその光景を冷ややかに見ていた。",
    descriptionEn: "Bamboo-spear drills were held in the neighborhood under the slogan calling for the defeat of Britain and the United States. Gen's father, Daikichi, watched the scene with a critical eye."
  },

  {
    titleJa: "学童集団疎開",
    titleEn: "Schoolchildren Evacuate from Hiroshima",
    descriptionJa: "次兄・昭は学童疎開のため、家族に見送られながら神崎国民学校を出発する。",
    descriptionEn: "Gen's second-oldest brother, Akira, leaves Kanzaki National School with other children as part of the wartime school evacuation program, seen off by his family."
  },

  {
    titleJa: "疎開先の寺へ",
    titleEn: "To the Evacuation Temple",
    descriptionJa: "昭たち疎開児童は広島を離れ、島根県との県境近くにある疎開先の寺へ向かう。",
    descriptionEn: "Akira and the other evacuated schoolchildren leave Hiroshima for a temple near the border with Shimane Prefecture."
  },

  {
    titleJa: "大吉、特高に逮捕される",
    titleEn: "Daikichi Arrested by the Special Higher Police",
    descriptionJa: "父・大吉は町内会長の嫌がらせをきっかけに特高警察に逮捕され、舟入本町の家から連行される。",
    descriptionEn: "Following harassment by the neighborhood association leader, Gen's father, Daikichi, is arrested by the Special Higher Police and taken away from the family's home in Funairi-honmachi."
  },

  {
    titleJa: "西警察署へ",
    titleEn: "Taken to Nishi Police Station",
    descriptionJa: "大吉は西警察署へ連行される。戦争に反対する言動によって、中岡家への圧力はさらに強まっていく。",
    descriptionEn: "Daikichi is taken to Nishi Police Station. Because of his outspoken opposition to the war, pressure on the Nakaoka family continues to intensify."
  },

  {
    titleJa: "学校へ向かう朝",
    titleEn: "The Morning Walk to School",
    descriptionJa: "1945年8月6日の朝。空襲警報が解除され、人々が学校や職場へ戻るなか、ゲンも家を出て学校へ向かう。",
    descriptionEn: "On the morning of August 6, 1945, the air-raid alert is lifted. As people return to their schools and workplaces, Gen leaves home and heads for school."
  },

  {
    titleJa: "学校の塀の下で被爆",
    titleEn: "The Atomic Bomb Explodes",
    descriptionJa: "学校近くの塀のそばでおばさんに声をかけられ、ゲンが立ち止まる。その瞬間、広島上空で原子爆弾が炸裂する。",
    descriptionEn: "Near a wall by his school, Gen stops when a woman calls out to him. At that moment, the atomic bomb explodes over Hiroshima."
  },

  {
    titleJa: "炎の中を歩く",
    titleEn: "Walking Through the Burning City",
    descriptionJa: "被爆直後、ゲンは炎と瓦礫、傷ついた人々のなかを舟入本町の自宅へ向かって歩き続ける。",
    descriptionEn: "Immediately after the bombing, Gen makes his way toward his home in Funairi-honmachi through flames, rubble, and crowds of injured people."
  },

  {
    titleJa: "生家へ戻り家族救出を試みる",
    titleEn: "Trying to Rescue His Family",
    descriptionJa: "ゲンは生家へたどり着く。しかし父、姉、弟は崩れた家の下敷きとなり、母とともに救出を試みる。",
    descriptionEn: "Gen reaches his home, but his father, sister, and younger brother are trapped beneath the collapsed house. Together with his mother, he desperately tries to rescue them."
  },

  {
    titleJa: "私道へ避難・友子誕生",
    titleEn: "Evacuation and Tomoko's Birth",
    descriptionJa: "炎が迫るなか、ゲンと母は家族を残して避難する。避難先の私道で、母は友子を出産する。",
    descriptionEn: "As the flames close in, Gen and his mother are forced to flee, leaving the trapped family members behind. At their place of refuge, his mother gives birth to Tomoko."
  },

  {
    titleJa: "被爆後の市街を歩く",
    titleEn: "Through Hiroshima After the Bombing",
    descriptionJa: "被爆後の広島市街をゲンは歩く。兵士や負傷者、動かなくなった電車など、変わり果てた街を目にする。",
    descriptionEn: "Gen walks through Hiroshima after the bombing, encountering soldiers, injured people, disabled streetcars, and a city transformed by destruction."
  },

  {
    titleJa: "似島検疫所",
    titleEn: "Ninoshima Quarantine Station",
    descriptionJa: "ゲンは夏江とともに似島の検疫所へ向かう。そこには被爆によって傷ついた多くの人々が運び込まれていた。",
    descriptionEn: "Gen travels with Natsue to the quarantine station on Ninoshima, where large numbers of people injured by the atomic bombing have been brought."
  },

  {
    titleJa: "市街へ戻る",
    titleEn: "Returning to Hiroshima",
    descriptionJa: "ゲンは再び広島市街へ戻り、母と生まれたばかりの友子が待つ避難場所へ向かう。",
    descriptionEn: "Gen returns to Hiroshima and makes his way back to the refuge where his mother and newborn sister, Tomoko, are waiting."
  },

  {
    titleJa: "隆太と出会う",
    titleEn: "Meeting Ryuta",
    descriptionJa: "ゲンは、亡くなった弟・進によく似た少年、隆太と出会う。",
    descriptionEn: "Gen meets a boy named Ryuta, who closely resembles his younger brother Shinji, who died in the bombing."
  },

  {
    titleJa: "朴さんと再会",
    titleEn: "Reuniting with Mr. Pak",
    descriptionJa: "ゲンは朴さんと再会する。朴さんは、日本人に助けてもらえず亡くなった父を葬るため、自ら棺桶を作っていた。",
    descriptionEn: "Gen reunites with Mr. Pak. After his father dies without receiving help from the Japanese around him, Mr. Pak builds a coffin with his own hands so that he can bury him."
  },

  {
    titleJa: "焼け跡の生家・遺骨収集",
    titleEn: "Returning to the Ruins of Home",
    descriptionJa: "ゲンは焼け跡となった舟入本町の生家へ戻り、亡くなった家族の遺骨を探す。",
    descriptionEn: "Gen returns to the burned ruins of his family home in Funairi-honmachi and searches for the remains of his family."
  },

  {
    titleJa: "江波親戚宅",
    titleEn: "Taking Refuge with Relatives in Eba",
    descriptionJa: "ゲンたちは舟入本町を離れ、江波にある親戚の家へ身を寄せる。",
    descriptionEn: "Gen and his family leave Funairi-honmachi and take refuge at a relative's home in Eba."
  },

  {
  titleJa: "バイト先で介護する政二を江波射撃場へ",
  titleEn: "Taking Seiji to the Eba Army Firing Range",
  descriptionJa: "生活費を得るため、ゲンは江波に住む政二を介護する仕事を始める。ゲンと竜太は政二をリヤカーに乗せ、写生のため江波の土手へ連れ出す。そこは、多くの被爆者の遺体が運ばれ火葬された旧陸軍射撃場だったと考えられる。政二との交流を通じて、ゲンは絵を描くことと出会っていく。",
  descriptionEn: "To earn money, Gen begins caring for Seiji in Eba. Gen and Ryuta take him by handcart to sketch near the embankment. This area is believed to have been part of the former army firing range, where many victims' bodies were brought and cremated after the bombing. Through Seiji, Gen begins to discover drawing and painting."
},

  {
    titleJa: "元川小学校で野村道子と出会う",
  titleEn: "Meeting Michiko Nomura at Motokawa Elementary School",
  descriptionJa: "ゲンは漫画に登場する元川小学校で、原爆によって髪を失った少女・野村道子と出会う。元川小学校は、実在する本川小学校をモデルにしたと考えられる。道子は、アメリカ兵と付き合っている姉とともに暮らしていた。",
  descriptionEn: "At Motokawa Elementary School in the manga, Gen meets Michiko Nomura, a girl who lost her hair after the atomic bombing. The fictional school is believed to have been modeled on the real Honkawa Elementary School. Michiko lived with her older sister, who was involved with an American soldier."
  },

  {
  titleJa: "友子の死――江波の海岸へ",
  titleEn: "Tomoko's Death — To the Coast of Eba",
  descriptionJa: "妹・友子が亡くなる。漫画では江波の海岸で荼毘に付されるが、正確な場所と死去の日付は特定できていない。",
  descriptionEn: "Gen's younger sister Tomoko dies. In the manga, she is cremated on the coast of Eba, but the exact location and date have not been identified."
},
{
  titleJa: "原爆犠牲となった米兵捕虜",
  titleEn: "American POWs Killed by the Atomic Bomb",
  descriptionJa: "相生橋東詰で、ゲンは原爆犠牲となった米兵捕虜に石を投げる人々を目にする。ゲンは「アメリカは自分の国の兵隊まで殺しやがった。ひどいことをしやがる」と憤る。そして以前、米兵捕虜の収容所を通りかかった際、捕虜へ石つぶてを投げる日本人を見て、父・大吉が「敵兵にも親や兄弟がいるだろうに」と語ったことを思い出す。",
  descriptionEn: "Near the east end of Aioi Bridge, Gen sees people throwing stones at American prisoners of war killed by the atomic bomb. He says angrily, 'America even killed its own soldiers. What a terrible thing to do.' He then remembers an earlier occasion when they passed a POW camp. Seeing Japanese people throw stones at the prisoners, his father Daikichi had said, 'Even enemy soldiers have parents and siblings.'"
}

];


// ================================
// Autobiography Timeline
// ================================

const autobiographyTimeline = [
  "S02",
  "S01",
  "S11",
  "S03",
  "S12",
  "S14",
  "S09",
  "A02",
  "S04",
  "S10",
  "S02",
  "S04",
  "M01",
  "M04",
  "S07",
  "S07",
  "S02",
  "A01",
  "S07",
  "S16"
];

const autobiographyStories = [
{
  titleJa: "舟入本町 ― 中沢啓治の生家",
  titleEn: "Funairi-honmachi — Keiji Nakazawa's Home",

  descriptionJa: "はだしのゲンの作者、中沢啓治は広島・舟入本町で生まれ育った。中沢家は元は広島城主、浅野家につかえる足軽組（御走・おかち）であったらしいが、廃藩置県とともに漆を主体とした塗装業に転業、広島地方特産の下駄やふすまの枠、木器等を塗装し生計を立てていた。啓治は父・母・兄二人、姉一人、弟一人とねこの家族とともにこの町で暮らしていた。",
 descriptionEn: "Keiji Nakazawa, the author of Barefoot Gen, was born and raised in Funairi-honmachi, Hiroshima. The Nakazawa family is said to have originally belonged to a group of foot soldiers serving the Asano clan, the lords of Hiroshima Castle. After the abolition of the feudal domains, the family turned to lacquer-based painting work, making a living by painting geta sandals, fusuma frames, woodenware, and other products associated with Hiroshima. Keiji lived here with his father, mother, two older brothers, an older sister, a younger brother, and the family cat."
},
{
  titleJa: "産業奨励館 ― 父・晴海の作品",
  titleEn: "The Industrial Promotion Hall — Harumi's Artwork",
  descriptionJa: "父は日本画や蒔絵を手がけ、産業奨励館の県美展にも作品を出していた。また左翼系の劇団活動にも関わっていた。",
  descriptionEn: "His father, Harumi, worked in Japanese-style painting and maki-e lacquer art, and exhibited his work at a prefectural art exhibition held at the Industrial Promotion Hall. He was also involved in a left-wing theater group."
},
{
  titleJa: "父の逮捕 ― 思想犯として拘置",
  titleEn: "His Father's Arrest — Detained as a Political Offender",
  descriptionJa: "戦争に反対する父は思想犯として連行され、広島県庁内にあった拘置所に収容された。家族にも「非国民」への圧力が及んでいく。",
  descriptionEn: "His father, who opposed the war, was arrested as a political offender and detained at a facility within the Hiroshima Prefectural Government compound. The family also came under increasing pressure as they were branded unpatriotic."
},
{
  titleJa: "姉・英子への嫌がらせ",
  titleEn: "Harassment of His Sister Eiko",
  descriptionJa: "「非国民」の家族として、姉・英子も学校で嫌がらせを受けた。泥棒の濡れ衣を着せられる出来事も起きた。",
  descriptionEn: "As a member of a family branded unpatriotic, Keiji's sister Eiko was also harassed at school. She was even falsely accused of stealing."
},
{
  titleJa: "食糧難と江波での記憶",
  titleEn: "Food Shortages and Memories of Eba",
  descriptionJa: "食糧難のなか、江波射撃場でイナゴを捕って食べ、江波の食堂では団子を求めた。護国神社の招魂祭で父に買ってもらったサトウキビも、強い記憶として残った。",
  descriptionEn: "Amid severe food shortages, Keiji caught and ate grasshoppers at the Eba firing range and searched for dumplings at an eatery in Eba. He also retained a vivid memory of the sugarcane his father bought him at a festival at Gokoku Shrine."
},
{
  titleJa: "父との厳島での記憶",
  titleEn: "Memories of Itsukushima with His Father",
  descriptionJa: "栄養失調によるできものに苦しんだ頃、父と厳島へ行き、海水につかって治そうとした。父と写生をした記憶も残っている。",
  descriptionEn: "When Keiji suffered from sores caused by malnutrition, he went to Itsukushima with his father and immersed himself in seawater in an attempt to heal them. He also remembered sketching there with his father."
},
{
  titleJa: "長兄の学徒動員",
  titleEn: "His Eldest Brother's Student Mobilization",
  descriptionJa: "長兄は学徒動員され、呉の海軍軍需工場で軍艦製造の仕事に駆り出された。",
  descriptionEn: "Keiji's eldest brother was mobilized as a student and assigned to work in warship production at the Kure Naval Arsenal."
},
{
  titleJa: "町内の竹やり訓練",
  titleEn: "Bamboo-Spear Drills in the Neighborhood",
  descriptionJa: "町内では「撃滅鬼畜米英」を叫びながら竹やり訓練が行われた。父は戦争へ向かう社会の空気を冷ややかに見ていた。",
  descriptionEn: "Bamboo-spear drills were held in the neighborhood as people shouted slogans calling for the destruction of Britain and America. His father viewed the increasingly militaristic atmosphere with deep skepticism."
},
{
  titleJa: "次兄・昭の学童疎開",
  titleEn: "Akira's Evacuation from Hiroshima",
  descriptionJa: "次兄・昭は学童疎開のため、家族に見送られながら神崎国民学校を出発した。",
  descriptionEn: "Keiji's older brother Akira left Kanzaki National Elementary School as part of the wartime evacuation of schoolchildren, seeing his family off as he departed Hiroshima."
},
{
  titleJa: "疎開先の寺へ",
  titleEn: "To the Evacuation Temple",
  descriptionJa: "昭たち疎開児童は広島を離れ、島根県との県境近くにある疎開先の寺へ向かった。",
  descriptionEn: "Akira and the other evacuated schoolchildren left Hiroshima for a temple near the border with Shimane Prefecture."
},
{
  titleJa: "1945年8月6日の朝",
  titleEn: "The Morning of August 6, 1945",
  descriptionJa: "1945年8月6日の朝。空襲警報が解除され、人々が学校や職場へ戻るなか、啓治も家を出て学校へ向かった。",
  descriptionEn: "On the morning of August 6, 1945, the air-raid warning was lifted. As people returned to their schools and workplaces, Keiji left home and headed for school."
},
{
  titleJa: "学校近くの塀の下で被爆",
  titleEn: "Caught in the Atomic Bombing near His School",
  descriptionJa: "学校近くの塀のそばで同学年の生徒の母親に声をかけられて立ち止まった。そのとき、広島上空で原子爆弾が炸裂した。",
  descriptionEn: "Near his school, Keiji stopped beside a wall when the mother of a fellow student called out to him. At that moment, the atomic bomb exploded over Hiroshima."
},
{
  titleJa: "炎に阻まれた帰路",
  titleEn: "His Route Home Blocked by Fire",
  descriptionJa: "被爆後、啓治は自宅へ戻ろうとするが、炎に阻まれる。電車道へ戻り、別の経路から舟入本町を目指した。",
  descriptionEn: "After the bombing, Keiji tried to return home but was blocked by fire. He went back to the streetcar road and tried another route toward Funairi-honmachi."
},
{
  titleJa: "母との再会",
  titleEn: "Reunited with His Mother",
  descriptionJa: "舟入川口町の電停付近で母と再会する。母が抱いていたぼろ布に気づき、その中を見ると、被爆時の衝撃でその日に生まれた妹・友子がいた。",
  descriptionEn: "Near the streetcar stop at Funairi-kawaguchicho, Keiji was reunited with his mother. He noticed the bundle of rags in her arms and discovered his newborn sister, Tomoko, who had been born that day amid the shock of the atomic bombing."
},
{
  titleJa: "江波の親戚宅へ",
  titleEn: "To His Relatives' Home in Eba",
  descriptionJa: "啓治たちは江波にある親戚の家へ身を寄せ、被爆後の生活を始める。",
  descriptionEn: "Keiji and his surviving family members took refuge at a relative's home in Eba and began their lives in the aftermath of the bombing."
},
{
  titleJa: "母が家族の最期を語る",
  titleEn: "His Mother Recounts the Family's Final Moments",
  descriptionJa: "江波の親戚宅で、母は家の下敷きになった家族の最期を啓治たちに語った。",
  descriptionEn: "At their relatives' home in Eba, Keiji's mother told them about the final moments of the family members who had been trapped beneath their collapsed house."
},
{
  titleJa: "焼け跡での遺骨収集",
  titleEn: "Collecting the Family's Remains",
  descriptionJa: "翌日、啓治は母の依頼で、長兄とともに借りた自転車で焼け跡となった舟入本町の生家へ戻り、亡くなった家族の遺骨を拾った。",
  descriptionEn: "The following day, at his mother's request, Keiji returned with his eldest brother by borrowed bicycle to the ruins of their home in Funairi-honmachi, where they collected the remains of their family members."
},
{
  titleJa: "破壊された広島中心部",
  titleEn: "The Devastated Center of Hiroshima",
  descriptionJa: "啓治は長兄と自転車で広島の中心部へ向かい、原爆によって破壊された街と死体の山を目にした。",
  descriptionEn: "Keiji and his eldest brother rode their bicycles into central Hiroshima, where they witnessed the city devastated by the atomic bomb and piles of dead bodies."
},
{
  titleJa: "江波で続いた差別といじめ",
  titleEn: "Discrimination and Bullying in Eba",
  descriptionJa: "江波での生活でも家族への差別やいじめは続いた。母への泥棒の濡れ衣、次兄へのいじめ、啓治自身へのいじめも経験した。",
  descriptionEn: "Discrimination and bullying against the family continued in Eba. His mother was falsely accused of stealing, his older brother was bullied, and Keiji himself also experienced harassment."
},
{
  titleJa: "妹・友子の死",
  titleEn: "The Death of His Sister Tomoko",
  descriptionJa: "自伝では、原爆投下後に生まれた妹・友子は、誕生から約4か月半後に亡くなったと記されている。",
  descriptionEn: "In his autobiography, Nakazawa writes that his younger sister Tomoko, who was born after the atomic bombing, died about four and a half months after her birth."
}
];


// 現在のManga Scene番号
let mangaSceneIndex = 0;
let currentStoryMode = "manga";

// Scene IDからlocations内の地点データを取得
function getLocationById(id) {
  return locations.find((loc) => loc.id === id);
}

// Manga Sceneへ移動
function goToMangaScene(index) {
  currentStoryMode = "manga";
  // 範囲外に出ないようにする
  if (index < 0 || index >= mangaTimeline.length) {
    return;
  }

  mangaSceneIndex = index;

const locationId = mangaTimeline[mangaSceneIndex];
const loc = getLocationById(locationId);

const sceneTitle = document.getElementById("mangaSceneTitle");

// ========================================
// Manga Story Panel を現在Sceneに同期
// ========================================

const story = mangaStories[mangaSceneIndex];

document.getElementById("mangaStoryNumber").textContent =
  `Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length}`;

document.getElementById("mangaStoryTitle").textContent =
  story
    ? (
        currentLanguage === "en"
          ? (story.titleEn || story.title)
          : (story.titleJa || story.title)
      )
    : "Scene title";

document.getElementById("mangaStoryDescription").textContent =
  story
    ? (
        currentLanguage === "en"
          ? (story.descriptionEn || story.description)
          : (story.descriptionJa || story.description)
      )
    : "";
  
// Previous / Next ボタン
const prevBtn = document.getElementById("mangaPrevBtn");
const nextBtn = document.getElementById("mangaNextBtn");

prevBtn.disabled = false;
nextBtn.disabled = false;

// 座標がまだ無いScene
// 座標がまだ無いScene
if (!loc) {

  // 前のSceneのピン選択を解除する
  viewer.selectedEntity = undefined;

  // すべてのManga地点を通常サイズへ戻す
  mangaTimeline.forEach((id) => {
    if (!id) return;

    const e = viewer.entities.getById(`location_${id}`);

    if (e && e.point) {
      e.point.pixelSize = 11;
    }
  });

   // Scene 17：朴さんとの再会
  // 家の正確な場所は不明。舟入川口町電停周辺だけを表示する
  if (locationId === "A03") {

    sceneTitle.textContent =
      currentLanguage === "en"
        ? `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — Near Funairi-kawaguchicho Stop (exact location unknown)`
        : `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — 舟入川口町電停周辺（正確な場所不明）`;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        132.43975,
        34.38043,
        3000
      ),
      duration: 1.5
    });

  // Scene 22：友子の死
  // 正確な地点を断定せず、江波一帯を広く表示する
  } else if (mangaSceneIndex === 21) {

    sceneTitle.textContent =
      currentLanguage === "en"
        ? `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — Eba Coast (exact location unknown)`
        : `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — 江波海岸（正確な位置未特定）`;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        132.433,
        34.365,
        4000
      ),
      duration: 1.5
    });

  } else {

    sceneTitle.textContent =
      currentLanguage === "en"
        ? `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — Location not identified`
        : `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — 位置未特定`;
  }

  console.warn(
    "Location not yet mapped:",
    mangaSceneIndex + 1
  );

  return;
}   
// 座標があるScene
const displayedSceneTitle =
  story
    ? (
        currentLanguage === "en"
          ? (story.titleEn || story.titleJa || loc.title)
          : (story.titleJa || story.titleEn || loc.title)
      )
    : loc.title;

sceneTitle.textContent =
  `Manga Scene ${mangaSceneIndex + 1} / ${mangaTimeline.length} — ${locationId} ${displayedSceneTitle}`;
  // Scene 10 route をいったん非表示
const scene10Route = viewer.entities.getById("manga_scene10_route");

if (scene10Route) {
  scene10Route.show =
    mangaSceneIndex === 9 || mangaSceneIndex === 10;
}


// Scene 10: S04 → P02 → P03 → S02 の推定帰宅経路
if (mangaSceneIndex === 9) {

const routeIds = ["S04", "P02", "P03", "S02"];

  const routePositions = routeIds
    .map(id => getLocationById(id))
    .filter(Boolean)
    .map(p => Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 5));

  const routeFadeStart = performance.now();

  let routeEntity = viewer.entities.getById("manga_scene10_route");

  if (!routeEntity && routePositions.length >= 2) {
    routeEntity = viewer.entities.add({
      id: "manga_scene10_route",
      polyline: {
        positions: routePositions,
        width: 5,
        material: new Cesium.ColorMaterialProperty(
  new Cesium.CallbackProperty(() => {
    const elapsed = (performance.now() - routeFadeStart) / 5000;
    const alpha = Math.min(elapsed, 1.0);
    return Cesium.Color.DODGERBLUE.withAlpha(alpha);
  }, false)
),
        clampToGround: true
      }
    });
  }

  if (routeEntity) {
  routeEntity.show = true;
}

// Scene 10: route 全体が入るようにカメラ移動
if (routePositions.length >= 2) {
  const boundingSphere =
    Cesium.BoundingSphere.fromPoints(routePositions);

  viewer.camera.flyToBoundingSphere(
    boundingSphere,
    {
      duration: 1.5,
      offset: new Cesium.HeadingPitchRange(
        0,
        Cesium.Math.toRadians(-90),
        boundingSphere.radius * 4
      )
    }
  );
}
}

 if (mangaSceneIndex === 9) {
  // Scene 10は上で route 全体へカメラ移動済み
} else {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      loc.lon,
      loc.lat,
      1200
    ),
    duration: 1.5
  });
}

// Manga Timeline の全地点を通常サイズに戻す
mangaTimeline.forEach((id) => {
  const e = viewer.entities.getById(`location_${id}`);

  if (e && e.point) {
    e.point.pixelSize = 11;
  }
});

// 現在のSceneを強調
const currentEntity =
  viewer.entities.getById(`location_${loc.id}`);

if (currentEntity && currentEntity.point) {
  currentEntity.point.pixelSize = 20;
}

// 対応する地点を選択状態にする
const entity = viewer.entities.getById(`location_${loc.id}`);

if (entity) {
  const displayedDescription =
    story
      ? (
          currentLanguage === "en"
            ? (story.descriptionEn || story.descriptionJa || "")
            : (story.descriptionJa || story.descriptionEn || "")
        )
      : "";

  const sourceTranslations = {
    "史実": "Historical record",
    "漫画": "Manga",
    "自伝": "Autobiography",
    "漫画・自伝": "Manga / Autobiography",
    "漫画・史実": "Manga / Historical record",
    "漫画・自伝・史料": "Manga / Autobiography / Historical sources",
    "自伝・史料": "Autobiography / Historical sources",
    "自伝＋史料": "Autobiography / Historical sources"
  };

  const displayedSource =
    currentLanguage === "en"
      ? (sourceTranslations[loc.source] || loc.source)
      : loc.source;

  const surfaceDistance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
    Cesium.Cartesian3.fromDegrees(132.4536, 34.3955, 0)
  );

  const burstPoint = Cesium.Cartesian3.fromDegrees(
    132.4536,
    34.3955,
    600
  );

  const slantDistance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
    burstPoint
  );

  entity.name = `${locationId} ${displayedSceneTitle}`;

  entity.description =
    currentLanguage === "en"
      ? `
          <h3>${locationId} ${displayedSceneTitle}</h3>
          <p>${displayedDescription}</p>
          <hr>
          <p><b>Source:</b> ${displayedSource}</p>
          <p><b>Confidence:</b> ${loc.confidence}</p>
          <hr>
          <p><b>Horizontal distance from the hypocenter:</b> ${surfaceDistance.toFixed(0)} m</p>
          <p><b>Distance to the explosion point at 600 m:</b> ${slantDistance.toFixed(0)} m</p>
        `
      : `
          <h3>${locationId} ${displayedSceneTitle}</h3>
          <p>${displayedDescription}</p>
          <hr>
          <p><b>資料:</b> ${displayedSource}</p>
          <p><b>確度:</b> ${loc.confidence}</p>
          <hr>
          <p><b>爆心地からの水平距離:</b> ${surfaceDistance.toFixed(0)} m</p>
          <p><b>上空600mの爆発点まで:</b> ${slantDistance.toFixed(0)} m</p>
        `;

  viewer.selectedEntity = entity;
}
}
// ========================================
// Autobiography Sceneへ移動
// ========================================
let autobiographySceneIndex = 0;
let currentLanguage = "ja";

function goToAutobiographyScene(index) {
currentStoryMode = "autobiography";
  // 範囲外に出ないようにする
  if (index < 0 || index >= autobiographyTimeline.length) {
    return;
  }

  autobiographySceneIndex = index;

  const locationId = autobiographyTimeline[autobiographySceneIndex];
  const loc = getLocationById(locationId);
  const story = autobiographyStories[autobiographySceneIndex];
  const sceneTitle = document.getElementById("mangaSceneTitle");

const displayedSceneTitle =
  story
    ? (
        currentLanguage === "en"
          ? (story.titleEn || story.titleJa || (loc && loc.title))
          : (story.titleJa || story.titleEn || (loc && loc.title))
      )
    : (loc ? loc.title : "");

sceneTitle.textContent =
  loc
    ? `Autobiography Scene ${autobiographySceneIndex + 1} / ${autobiographyTimeline.length} — ${locationId} ${displayedSceneTitle}`
    : (
        currentLanguage === "en"
          ? `Autobiography Scene ${autobiographySceneIndex + 1} / ${autobiographyTimeline.length} — Location not identified`
          : `Autobiography Scene ${autobiographySceneIndex + 1} / ${autobiographyTimeline.length} — 位置未特定`
      );
// ========================================
// Autobiography Story Panel を現在Sceneに同期
// ========================================

document.getElementById("mangaStoryNumber").textContent =
  `Autobiography ${autobiographySceneIndex + 1} / ${autobiographyTimeline.length}`;

document.getElementById("mangaStoryTitle").textContent =
  story
    ? (currentLanguage === "en"
        ? (story.titleEn || story.titleJa || story.title)
        : (story.titleJa || story.title))
    : "Scene title";

document.getElementById("mangaStoryDescription").textContent =
  story
    ? (currentLanguage === "en"
        ? (story.descriptionEn || story.descriptionJa || story.description)
        : (story.descriptionJa || story.description))
    : "";
// Previous / Next button state
document.getElementById("mangaPrevBtn").disabled = false;
document.getElementById("mangaNextBtn").disabled = false;

  // まずConsoleで動作確認
  console.log(
    `Autobiography Scene ${autobiographySceneIndex + 1}`,
    locationId,
    story
  );

  // 座標がまだ無いScene
  if (!loc) {
    console.warn("Autobiography location not yet mapped:", locationId);
    return;
  }

  // Cesiumでその地点へ移動
  // ========================================
// Autobiography: homeward route blocked by fire
// P03 -> M01 : reconstructed movement
// M01 -> S02 : intended destination, not reached
// ========================================

let autoRouteActual =
  viewer.entities.getById("auto_route_actual");

let autoRouteUnreached =
  viewer.entities.getById("auto_route_unreached");

// 基本は非表示
if (autoRouteActual) autoRouteActual.show = false;
if (autoRouteUnreached) autoRouteUnreached.show = false;

// M01のSceneだけ表示
if (locationId === "M01") {

const s04 = getLocationById("S04");
const p02 = getLocationById("P02");
const p03 = getLocationById("P03");
const m01 = getLocationById("M01");
const home = getLocationById("S02");

 if (s04 && p02 && p03 && m01) {
    if (!autoRouteActual) {
      autoRouteActual = viewer.entities.add({
        id: "auto_route_actual",
        polyline: {
        positions: [
  Cesium.Cartesian3.fromDegrees(s04.lon, s04.lat, 5),
  Cesium.Cartesian3.fromDegrees(p02.lon, p02.lat, 5),
  Cesium.Cartesian3.fromDegrees(p03.lon, p03.lat, 5),
  Cesium.Cartesian3.fromDegrees(m01.lon, m01.lat, 5)
],
          width: 5,
          material: Cesium.Color.MAGENTA.withAlpha(0.9),
          clampToGround: true
        }
      });
    }
    autoRouteActual.show = true;
  }

  if (m01 && home) {
    if (!autoRouteUnreached) {
      autoRouteUnreached = viewer.entities.add({
        id: "auto_route_unreached",
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(m01.lon, m01.lat, 5),
            Cesium.Cartesian3.fromDegrees(home.lon, home.lat, 5)
          ],
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.MAGENTA.withAlpha(0.5),
            dashLength: 16
          }),
          clampToGround: true
        }
      });
    }
    autoRouteUnreached.show = true;
  }
}
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      loc.lon,
      loc.lat,
      1200
    ),
    duration: 1.5
  });

  // Timelineの地点を通常サイズに戻す
  autobiographyTimeline.forEach((id) => {
    const e = viewer.entities.getById(`location_${id}`);

    if (e && e.point) {
      e.point.pixelSize = 11;
    }
  });

  // 現在地点を強調
  const currentEntity =
    viewer.entities.getById(`location_${loc.id}`);

  if (currentEntity && currentEntity.point) {
    currentEntity.point.pixelSize = 20;
  }

  // 対応地点を選択状態にする
const entity =
  viewer.entities.getById(`location_${loc.id}`);

if (entity) {
  const displayedDescription =
    story
      ? (
          currentLanguage === "en"
            ? (story.descriptionEn || story.descriptionJa || "")
            : (story.descriptionJa || story.descriptionEn || "")
        )
      : "";

  const sourceTranslations = {
    "史実": "Historical record",
    "漫画": "Manga",
    "自伝": "Autobiography",
    "漫画・自伝": "Manga / Autobiography",
    "漫画・史実": "Manga / Historical record",
    "漫画・自伝・史料": "Manga / Autobiography / Historical sources",
    "自伝・史料": "Autobiography / Historical sources",
    "自伝＋史料": "Autobiography / Historical sources"
  };

  const displayedSource =
    currentLanguage === "en"
      ? (sourceTranslations[loc.source] || loc.source)
      : loc.source;

  const surfaceDistance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
    Cesium.Cartesian3.fromDegrees(132.4536, 34.3955, 0)
  );

  const burstPoint = Cesium.Cartesian3.fromDegrees(
    132.4536,
    34.3955,
    600
  );

  const slantDistance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
    burstPoint
  );

  entity.name = `${locationId} ${displayedSceneTitle}`;

  entity.description =
    currentLanguage === "en"
      ? `
          <h3>${locationId} ${displayedSceneTitle}</h3>
          <p>${displayedDescription}</p>
          <hr>
          <p><b>Source:</b> ${displayedSource}</p>
          <p><b>Confidence:</b> ${loc.confidence}</p>
          <hr>
          <p><b>Horizontal distance from the hypocenter:</b> ${surfaceDistance.toFixed(0)} m</p>
          <p><b>Distance to the explosion point at 600 m:</b> ${slantDistance.toFixed(0)} m</p>
        `
      : `
          <h3>${locationId} ${displayedSceneTitle}</h3>
          <p>${displayedDescription}</p>
          <hr>
          <p><b>資料:</b> ${displayedSource}</p>
          <p><b>確度:</b> ${loc.confidence}</p>
          <hr>
          <p><b>爆心地からの水平距離:</b> ${surfaceDistance.toFixed(0)} m</p>
          <p><b>上空600mの爆発点まで:</b> ${slantDistance.toFixed(0)} m</p>
        `;

  viewer.selectedEntity = entity;
}
}

// Previous：先頭から最後へ循環
document
  .getElementById("mangaPrevBtn")
  .addEventListener("click", () => {

    if (currentStoryMode === "autobiography") {
      const previousIndex =
        (autobiographySceneIndex - 1 + autobiographyTimeline.length)
        % autobiographyTimeline.length;

      goToAutobiographyScene(previousIndex);

    } else {
      const previousIndex =
        (mangaSceneIndex - 1 + mangaTimeline.length)
        % mangaTimeline.length;

      goToMangaScene(previousIndex);
    }
  });

// Next：最後から先頭へ循環
document
  .getElementById("mangaNextBtn")
  .addEventListener("click", () => {

    if (currentStoryMode === "autobiography") {
      const nextIndex =
        (autobiographySceneIndex + 1)
        % autobiographyTimeline.length;

      goToAutobiographyScene(nextIndex);

    } else {
      const nextIndex =
        (mangaSceneIndex + 1)
        % mangaTimeline.length;

      goToMangaScene(nextIndex);
    }
  });
// Story mode switch
document
  .getElementById("mangaModeBtn")
  .addEventListener("click", () => {

    // 自伝Scene 13から戻る場合
    // Manga Scene 10「炎の中を歩く」へ戻る
    if (
      currentStoryMode === "autobiography" &&
      autobiographySceneIndex === 12
    ) {
      goToMangaScene(9);
      return;
    }

    goToMangaScene(0);
  });

document
  .getElementById("autobiographyModeBtn")
  .addEventListener("click", () => {

    // Manga Scene 10または11から切り替えた場合
    // Autobiography Scene 13「炎に阻まれた帰路」へ直接移動
    if (
      currentStoryMode === "manga" &&
      (mangaSceneIndex === 9 || mangaSceneIndex === 10)
    ) {
      goToAutobiographyScene(12);
      return;
    }

    goToAutobiographyScene(0);
  });

// Language switch
document
  .getElementById("japaneseBtn")
  .addEventListener("click", () => {
    currentLanguage = "ja";

    if (currentStoryMode === "autobiography") {
      goToAutobiographyScene(autobiographySceneIndex);
    } else {
      goToMangaScene(mangaSceneIndex);
    }
  });

document
  .getElementById("englishBtn")
  .addEventListener("click", () => {
    currentLanguage = "en";

    if (currentStoryMode === "autobiography") {
      goToAutobiographyScene(autobiographySceneIndex);
    } else {
      goToMangaScene(mangaSceneIndex);
    }
  });

// 初期表示ではTimelineを開始しない
// goToMangaScene(0);

locations.forEach((loc) => {

  let pointColor = Cesium.Color.YELLOW;

  if (loc.id.startsWith("A")) {
    pointColor = Cesium.Color.CYAN;
  } else if (loc.id.startsWith("P")) {
    pointColor = Cesium.Color.DODGERBLUE;
  } else if (loc.id.startsWith("M")) {
    pointColor = Cesium.Color.MAGENTA;
  } else if (loc.id.startsWith("N")) {
    pointColor = Cesium.Color.LIME;
  }

  // 爆心地からの水平距離
const surfaceDistance = Cesium.Cartesian3.distance(
  Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
  Cesium.Cartesian3.fromDegrees(132.4536, 34.3955, 0)
);

// 爆発点は爆心地上空600m
const burstPoint = Cesium.Cartesian3.fromDegrees(
  132.4536,
  34.3955,
  600
);

// 地点から爆発点までの直線距離（斜距離）
const slantDistance = Cesium.Cartesian3.distance(
  Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, 0),
  burstPoint
);

  viewer.entities.add({
    id: `location_${loc.id}`,
    name: `${loc.id} ${loc.title}`,

    position: Cesium.Cartesian3.fromDegrees(
      loc.lon,
      loc.lat
    ),
  
    point: {
      pixelSize: 11,
      color: pointColor,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },

    label: {
      text: loc.id,
      font: "16px sans-serif",
      pixelOffset: new Cesium.Cartesian2(0, -22),
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.6)
    },

    description: `
  <h3>${loc.id} ${loc.title}</h3>
  <p><b>Source:</b> ${loc.source}</p>
  <p><b>Confidence:</b> ${loc.confidence}</p>
  <hr>
  <p><b>爆心地からの水平距離:</b> ${surfaceDistance.toFixed(0)} m</p>
  <p><b>上空600mの爆発点まで:</b> ${slantDistance.toFixed(0)} m</p>
`
  });
});

// =====================================================
// Atomic Bomb Explosion Point
// 爆心地直上 約600m
// =====================================================

const explosionPoint = viewer.entities.add({
  id: "explosion_point_600m",
  name: "原爆爆発点（上空 約600m）",

  position: Cesium.Cartesian3.fromDegrees(
    132.4536,   // 爆心地 longitude
    34.3955,    // 爆心地 latitude
    600         // altitude 約600m
  ),

  ellipsoid: {
    radii: new Cesium.Cartesian3(35, 35, 35),
    material: Cesium.Color.YELLOW.withAlpha(0.9),
    outline: true,
    outlineColor: Cesium.Color.WHITE
  },

  label: {
    text: "Explosion Point\nApprox. 600 m",
    font: "16px sans-serif",
    pixelOffset: new Cesium.Cartesian2(0, -45),
    showBackground: true,
    backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
    disableDepthTestDistance: Number.POSITIVE_INFINITY
  },

  description: `
    <h3>原爆爆発点</h3>
    <p>爆心地直上 約600m</p>
    <p>1945年8月6日 8時15分</p>
  `
});

// =====================================================
// S04 Ground View → Explosion Point
// S04周辺の地表と上空600mの爆発点を同時に見る
// =====================================================

document
  .getElementById("viewExplosionFromS04")
  .addEventListener("click", () => {

    // S04 被爆地点
const s04Lon = 132.443796;
const s04Lat = 34.386763;

    // -------------------------------------------------
    // カメラ位置
    // S04より少し南西側へ引き、高さ約180mから見る
    // -------------------------------------------------
    // ------------------------------------------------
// Camera position
// View from S04 — Gen's exposure location
// S04の真上約30mから爆発点を見る
// ------------------------------------------------
// S04付近：手動で決めた「地上から爆発点を見上げる」視点
const cameraPosition = Cesium.Cartesian3.fromDegrees(
  132.4438080029531,
  34.38667039456299,
  1.0
);

const viewLabel = viewer.entities.getById("s04_view_label");

if (!viewLabel) {
  viewer.entities.add({
    id: "s04_view_label",

    position: Cesium.Cartesian3.fromDegrees(
  132.443796,
  34.386763,
  15
),

    label: {
      text: "View from S04 — Estimated exposure location",
      font: "18px sans-serif",
      fillColor: Cesium.Color.WHITE,
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
      pixelOffset: new Cesium.Cartesian2(0, -40),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  });
}

viewer.camera.flyTo({
  destination: cameraPosition,

  orientation: {
    heading: Cesium.Math.toRadians(41.96135188342385),
    pitch: Cesium.Math.toRadians(12.410042239977424),
    roll: Cesium.Math.toRadians(0.00013187000590876517)
  },

  duration: 2.0
});
});
// =====================================================
// S04 Exposure Location → Explosion Point
// 3D slant line
// =====================================================

// S04 被爆地点
const s04ExposurePosition = Cesium.Cartesian3.fromDegrees(
  132.443796,
  34.386763,
  2
);

// 爆発点：爆心地上空 約600m
const explosionPosition600m = Cesium.Cartesian3.fromDegrees(
  132.4536,
  34.3955,
  600
);

// S04 → 爆発点 の3Dライン
viewer.entities.add({
  id: "s04_to_explosion_line",

  polyline: {
    positions: [
      s04ExposurePosition,
      explosionPosition600m
    ],

    width: 3,

    material: Cesium.Color.YELLOW.withAlpha(0.85),

    // 地表や建物の裏に隠れにくくする
    depthFailMaterial: Cesium.Color.YELLOW.withAlpha(0.35)
  }
});

/*
    viewer.entities.add({
      id: scene.id,
      name: `${index + 1}. ${scene.title}`,
      position: Cesium.Cartesian3.fromDegrees(scene.lon, scene.lat),
      point: {
        pixelSize: 11,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      label: {
        text: `${index + 1}`,
        font: "16px sans-serif",
        pixelOffset: new Cesium.Cartesian2(0, -22),
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.6)
      },
      description: `
        <h3>${index + 1}. ${scene.title}</h3>
        <p>${scene.description}</p>
      `
    });
  });
  */
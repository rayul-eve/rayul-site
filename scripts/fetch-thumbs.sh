#!/bin/bash
# Downloads the default YouTube/Vimeo thumbnail for every project in gallery-v3.html
# into assets/images/thumbs/<project-id>.jpg. Run from anywhere: bash scripts/fetch-thumbs.sh
cd "$(dirname "$0")/.." || exit 1
mkdir -p assets/images/thumbs
ok=0; fail=0
get_yt() { for q in maxresdefault sddefault hqdefault; do curl -fsSL -o "assets/images/thumbs/$1.jpg" "https://i.ytimg.com/vi/$2/$q.jpg" && return 0; done; return 1; }
get_vm() { u="https://vimeo.com/$2"; [ -n "$3" ] && u="$u/$3"; t=$(curl -fsSL "https://vimeo.com/api/oembed.json?url=$u&width=1280" | grep -o '"thumbnail_url":"[^"]*"' | cut -d'"' -f4 | sed 's#\\/#/#g'); [ -n "$t" ] && curl -fsSL -o "assets/images/thumbs/$1.jpg" "$t"; }
if get_yt "project-yt-idle-crow" "w6FzChNkVrY" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-idle-crow"; fi
if get_vm "vimeo-girl-dont-cry-live" "1189542781" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-girl-dont-cry-live"; fi
if get_yt "project-yt-1" "VEW9E1EIQ1M" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-1"; fi
if get_vm "vimeo-vitaly-oblivion-s25" "1086260829" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-vitaly-oblivion-s25"; fi
if get_yt "project-yt-2" "0bxhAxRmrJw" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-2"; fi
if get_vm "vimeo-saint-andre-grimoire" "1180380678" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-saint-andre-grimoire"; fi
if get_vm "vimeo-4ye-holiday-s25" "1152323624" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-4ye-holiday-s25"; fi
if get_vm "vimeo-spencer-badu-s25" "1068478051" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-spencer-badu-s25"; fi
if get_yt "project-yt-3" "Y4SNF4iRMJA" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-3"; fi
if get_yt "project-yt-4" "" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-4"; fi
if get_yt "project-yt-5" "SJzhhWdJ5kw" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-5"; fi
if get_yt "project-yt-6" "iUcrHEb3YvE" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: project-yt-6"; fi
if get_vm "vimeo-gray-hawken-golden-state" "1072859381" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-gray-hawken-golden-state"; fi
if get_vm "vimeo-chris-larocca-ladybug" "1072858613" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-chris-larocca-ladybug"; fi
if get_vm "vimeo-lafrance-s24-two-brothers" "1019260930" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-lafrance-s24-two-brothers"; fi
if get_vm "vimeo-cherry-blu-shirt-never-fit" "1033728951" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-cherry-blu-shirt-never-fit"; fi
if get_vm "vimeo-adroc-after-rest" "928892869" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-adroc-after-rest"; fi
if get_vm "vimeo-jiwoo-afterimage" "936429043" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-jiwoo-afterimage"; fi
if get_vm "vimeo-lou-val-in-ur-motions" "907972764" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-lou-val-in-ur-motions"; fi
if get_vm "vimeo-amaal-nuux-the-middle" "838913497" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-amaal-nuux-the-middle"; fi
if get_vm "vimeo-spencer-badu-naso-s23" "840272063" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-spencer-badu-naso-s23"; fi
if get_vm "vimeo-spencer-badu-s23" "795354913" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-spencer-badu-s23"; fi
if get_vm "vimeo-vitaly-bpm-s23" "855555364" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-vitaly-bpm-s23"; fi
if get_vm "vimeo-concorde-ep-trailer" "790929123" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-concorde-ep-trailer"; fi
if get_vm "vimeo-mileena-eve-2" "788843088" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-mileena-eve-2"; fi
if get_vm "vimeo-2-sides-kavale" "786423131" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-2-sides-kavale"; fi
if get_vm "vimeo-adroc-kindred" "755993448" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-adroc-kindred"; fi
if get_vm "vimeo-wizkid-rolling-loud" "749777779" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-wizkid-rolling-loud"; fi
if get_vm "vimeo-ethereal-toussaint" "740914790" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-ethereal-toussaint"; fi
if get_vm "vimeo-seago-lawn-visualizer" "711863471" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-seago-lawn-visualizer"; fi
if get_vm "vimeo-radio-silence-stefan-ensea" "694750305" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-radio-silence-stefan-ensea"; fi
if get_vm "vimeo-baduhaus-s22" "703899499" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-baduhaus-s22"; fi
if get_vm "vimeo-fanatica-santi" "804531057" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-fanatica-santi"; fi
if get_vm "vimeo-presence" "512031476" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-presence"; fi
if get_vm "vimeo-intermission-fashion-film" "478246234" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-intermission-fashion-film"; fi
if get_vm "vimeo-vitaly-s19-campaign" "375209102" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-vitaly-s19-campaign"; fi
if get_vm "vimeo-its-not-you-its-me" "310207652" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: vimeo-its-not-you-its-me"; fi
if get_vm "showreel" "1183593139" "37c2129f54"; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: showreel"; fi
if get_vm "chichu-s27-echo" "1244403099" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: chichu-s27-echo"; fi
if get_yt "livingthing-oh-well" "y2ALfDG0f6M" ""; then ok=$((ok+1)); else fail=$((fail+1)); echo "missed: livingthing-oh-well"; fi
echo "done: $ok saved, $fail missed. thumbnails are in assets/images/thumbs"

#!/bin/bash
# ============================================================
# i2 Ministries — Image Download Script
# Run this from the project root: bash download-images.sh
# Requires: curl
# ============================================================

mkdir -p images

echo "Downloading images from WordPress CDN..."

# Homepage images
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2020/02/promolightbox.jpg?strip=all&sharp=1&w=800" -o images/hero-video-thumb.jpg
echo "  ✓ hero-video-thumb.jpg"

# About page - Joshua photo
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/Joshua-A-2017.jpg?strip=all&sharp=1" -o images/joshua-lingel.jpg
echo "  ✓ joshua-lingel.jpg"

# Video thumbnails
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2025/02/launching.jpg?strip=all&sharp=1&resize=960x540" -o images/vid-launching.jpg
echo "  ✓ vid-launching.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2025/06/brazil.jpg?strip=all&sharp=1&resize=1200x675" -o images/vid-brazil.jpg
echo "  ✓ vid-brazil.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2025/06/korean.jpg?strip=all&sharp=1&resize=1200x675" -o images/vid-korean.jpg
echo "  ✓ vid-korean.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2025/02/gand-gc.jpg?strip=all&sharp=1&resize=640x360" -o images/vid-great-commission.jpg
echo "  ✓ vid-great-commission.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2025/02/Why-Care-About-Mulsims.jpg?strip=all&sharp=1&resize=640x360" -o images/vid-why-care.jpg
echo "  ✓ vid-why-care.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/thumb_youtube01.png?strip=all&sharp=1&w=640" -o images/vid-gc-muslims.png
echo "  ✓ vid-gc-muslims.png"

# Gallery photos
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/00100sPORTRAIT_00100_BURST20181023093335231_COVER-min-scaled.jpg?strip=all&sharp=1&w=600" -o images/gallery-01.jpg
echo "  ✓ gallery-01.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/get-trained-page-PERU-GROUP-2-min.jpg?strip=all&sharp=1&w=600" -o images/gallery-02.jpg
echo "  ✓ gallery-02.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/IMG-20181026-WA0008-min.jpg?strip=all&sharp=1&w=600" -o images/gallery-03.jpg
echo "  ✓ gallery-03.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/18155940_1307348906013748_6350429292425507385_o-min-1.jpg?strip=all&sharp=1&w=600" -o images/gallery-04.jpg
echo "  ✓ gallery-04.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/Costa-Rica-Pastors-Conference.jpg?strip=all&sharp=1&w=600" -o images/gallery-05.jpg
echo "  ✓ gallery-05.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/2013_Angola_167.jpg?strip=all&sharp=1&w=600" -o images/gallery-06.jpg
echo "  ✓ gallery-06.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/Korea-Seminary-Training-Missionaries-to-Muslims-Islam-Seminar.jpg?strip=all&sharp=1&w=600" -o images/gallery-07.jpg
echo "  ✓ gallery-07.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/PERU-training.jpg?strip=all&sharp=1&w=600" -o images/gallery-08.jpg
echo "  ✓ gallery-08.jpg"

# Endorsement headshots
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/josh_-McDowell-300x300.png?strip=all&sharp=1" -o images/endorser-mcdowell.png
echo "  ✓ endorser-mcdowell.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/04/Michael-Licona-300x300.png?strip=all&sharp=1" -o images/endorser-licona.png
echo "  ✓ endorser-licona.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/04/William-Lane-Craig-300x300.png?strip=all&sharp=1" -o images/endorser-craig.png
echo "  ✓ endorser-craig.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/JP-Moreland-300x300.png?strip=all&sharp=1" -o images/endorser-moreland.png
echo "  ✓ endorser-moreland.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/04/David-Botelho-300x300.png?strip=all&sharp=1" -o images/endorser-botelho.png
echo "  ✓ endorser-botelho.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/Francis-Anfuso-300x300.png?strip=all&sharp=1" -o images/endorser-anfuso.png
echo "  ✓ endorser-anfuso.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/03/Robert-Coleman-300x300.png?strip=all&sharp=1" -o images/endorser-coleman.png
echo "  ✓ endorser-coleman.png"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2017/04/Stuart-McAllister-300x300.png?strip=all&sharp=1" -o images/endorser-mcallister.png
echo "  ✓ endorser-mcallister.png"

# PDF
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2023/05/i2-Mega-Strategy-Paper.pdf" -o images/i2-mega-strategy.pdf
echo "  ✓ i2-mega-strategy.pdf"

# Get Trained - Pathway card images
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2023/05/EMFC-get-trained.jpg?strip=all&sharp=1&w=800" -o images/pathway-emfci.jpg
echo "  ✓ pathway-emfci.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2020/01/mmwucard.jpg?strip=all&sharp=1&w=800" -o images/pathway-mmwu.jpg
echo "  ✓ pathway-mmwu.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2023/05/WISE.jpg?strip=all&sharp=1&w=800" -o images/pathway-wise.jpg
echo "  ✓ pathway-wise.jpg"
curl -sL "https://ewwwebw49ku.exactdn.com/wp-content/uploads/2020/02/wadi-min.jpg?strip=all&sharp=1&w=800" -o images/pathway-wadi.jpg
echo "  ✓ pathway-wadi.jpg"

echo ""
echo "✅ Done! $(ls images | wc -l) files downloaded to ./images/"
echo ""
echo "Next: run 'vercel' to deploy"

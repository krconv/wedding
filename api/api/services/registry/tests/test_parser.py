import decimal
import pytest
import pytest_mock

from .. import parser, schemas


@pytest.mark.asyncio
async def test_parser(mocker: pytest_mock.MockerFixture):
    mock_get = mocker.patch("aiohttp.ClientSession.get")
    mock_get.return_value.__aenter__.return_value.ok.return_value = True
    mock_get.return_value.__aenter__.return_value.text.return_value = LIVE_HTML
    zola = parser.ZolaParser()

    registry = await zola.fetch_and_parse_registry()

    assert registry == schemas.Registry(
        full_link="https://www.zola.com/registry/maddyandkodey",
        items=[
            schemas.RegistryItem(
                id="62e041d12de1540708000a03",
                title="$100 Gift Card",
                brand="Airbnb",
                price=decimal.Decimal(100.00),
                image_link="https://images.zola.com/84edd9cb-03ee-4019-9d48-b2ae66154892?w=420",
            ),
            schemas.RegistryItem(
                id="62e041df6281ea3bca9f649e",
                title="Logic Cast Iron Skillet",
                brand="Lodge",
                price=decimal.Decimal(34.99),
                image_link="https://images.zola.com/c9cfc821-b70a-418a-bcfe-a1eac75d1704?w=420",
            ),
        ],
    )


LIVE_HTML = """
<!DOCTYPE html>
<html>
  <head>
    <title>Our Zola Registry</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>

  <body>
    <div class="container">
      <div class="row registry-header-section">
        <div class="col-xs-12">
          <div class="registry-header">
            <a
              href="https://www.zola.com/registry/maddyandkodey"
              target="_blank"
              class="zola-logo zola-logo-black-114"
              >Zola</a
            >
            <h3>Sneak Peek of Our Zola Wedding Registry</h3>
            <a
              href="https://www.zola.com/registry/maddyandkodey"
              target="_blank"
              class="btn btn-black"
              >See Our Full Registry</a
            >
          </div>
        </div>
      </div>
      <div class="row product-tiles-section">
        <div class="col-xs-6 col-sm-4 col-md-3">
          <div class="product-tile">
            <a
              href="https://www.zola.com/registry/collection-item/62e041d12de1540708000a03"
              target="_blank"
              ><img
                class="product-image"
                src="//images.zola.com/84edd9cb-03ee-4019-9d48-b2ae66154892?w=420"
                alt="$100 Gift Card"
              />
              <div class="product-info">
                <div class="product-info-top">
                  <h6>Airbnb</h6>
                  <h4>$100 Gift Card</h4>
                  <div class="price-block">
                    <span class="product-price h4">$100</span>
                  </div>
                </div>
                <div class="product-info-bottom">
                  <div class="btn btn-primary btn-sm">Buy Now</div>
                  <p class="needed">
                    <span class="hidden-xs"
                      >Requested: 2 <span class="bullet">•</span> </span
                    >Still Needs: 2
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-md-3">
          <div class="product-tile">
            <a
              href="https://www.zola.com/registry/collection-item/62e041df6281ea3bca9f649e"
              target="_blank"
              ><img
                class="product-image"
                src="//images.zola.com/c9cfc821-b70a-418a-bcfe-a1eac75d1704?w=420"
                alt="Logic Cast Iron Skillet"
              />
              <div class="product-info">
                <div class="product-info-top">
                  <h6>Lodge</h6>
                  <h4>Logic Cast Iron Skillet</h4>
                  <div class="price-block">
                    <span class="product-price h4">$34.99</span>
                    <span class="product-msrp h6 hidden-xs">$49.49</span>
                  </div>
                </div>
                <div class="product-info-bottom">
                  <div class="btn btn-primary btn-sm">Buy Now</div>
                  <p class="needed">
                    <span class="hidden-xs"
                      >Requested: 1 <span class="bullet">•</span> </span
                    >Still Needs: 1
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
"""

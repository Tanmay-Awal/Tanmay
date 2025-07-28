import React from 'react'
import { Link } from "react-router-dom";
import "./Landing.css"; 
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isVisible, setIsVisible] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

    const navigate = useNavigate();

    const navilogin = () => {
        navigate('/Login');
    }
    const navisignup = () => {
        navigate('/Signup');
    }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>VolunteerHub</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>

            <button className="nav-btn login-btn" onClick={navilogin} >Login</button>
            <button className="nav-btn signup-btn" onClick={navisignup}>Create An Account</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Empower Your NGO with Smart Volunteer Management</h1>
          <p>Streamline volunteer coordination, track impact, and build stronger communities with our comprehensive management platform.</p>
        </div>
      </section>

      <section className="banner light-banner">
        <div className="banner-content">
          <h3>Join 500+ NGOs already making a difference</h3>
          <p>Trusted by organizations worldwide to manage volunteers effectively</p>
        </div>
      </section>


      <section id="features" className="features">
        <div className="container">
          <h2>Everything You Need to Manage Volunteers</h2>
          
          <div className={`feature-item scroll-animate ${isVisible['feature1'] ? 'visible' : ''}`} id="feature1">
            <div className="feature-content left">
              <h3>Smart Volunteer Registration</h3>
              <p>Streamline the onboarding process with customizable forms and automated welcome sequences.</p>
            </div>
            <div className="feature-image right diagonal-right">
              <div className="image-placeholder">
                <img src="https://videos.openai.com/vg-assets/assets%2Ftask_01k0sxg118f20bdkrc16z4c761%2F1753216631_img_1.webp?st=2025-07-22T19%3A34%3A44Z&se=2025-07-28T20%3A34%3A44Z&sks=b&skt=2025-07-22T19%3A34%3A44Z&ske=2025-07-28T20%3A34%3A44Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=PT76p3E2q5Hk%2FmxDxOcg68E78b4U9thpqeJ4au%2BYXLQ%3D&az=oaivgprodscus" alt="" />
              </div>
            </div>
          </div>

          <div className={`feature-item scroll-animate ${isVisible['feature2'] ? 'visible' : ''}`} id="feature2">
            <div className="feature-image left diagonal-left">
              <div className="image-placeholder">
                <img src="https://media.gettyimages.com/id/1498170916/photo/a-couple-is-taking-a-bag-of-food-at-the-food-and-clothes-bank.jpg?s=612x612&w=gi&k=20&c=OQXzpRYIt4_vr0b2tTz9Wsz8aCPi9FgUBwGSEeJaToM=" alt="" />
              </div>
            </div>
            <div className="feature-content right">
              <h3>Event & Schedule Management</h3>
              <p>Create events, assign volunteers, and track participation all in one centralized dashboard.</p>
            </div>
          </div>

          <div className={`feature-item scroll-animate ${isVisible['feature3'] ? 'visible' : ''}`} id="feature3">
            <div className="feature-content left">
              <h3>Impact Tracking & Reports</h3>
              <p>Measure your organization's impact with detailed analytics and automated reporting tools.</p>
            </div>
            <div className="feature-image right diagonal-right">
              <div className="image-placeholder">
                <img src="data:image/jpeg;base64,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" alt="" />
              </div>
            </div>
          </div>

          <div className={`feature-item scroll-animate ${isVisible['feature4'] ? 'visible' : ''}`} id="feature4">
            <div className="feature-image left diagonal-left">
              <div className="image-placeholder">
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTEhIVFhUXFxoaFxgXFxcYGBoYGBUXFxgaFxgYHSggGholHRoXIjEiJikrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0mICUtLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAL4BCQMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAgMEBgcBAAj/xABEEAACAQIDBQUFBQYEBQUBAAABAhEAAwQSIQUxQVFhBiJxgZETMlKhsSNCwdHwBxQWYpLhFTNygkNTotLxJDRUsuIX/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQAAgUBBv/EAC8RAAICAQQBBAEDAwQDAAAAAAECAAMRBBIhMUEFEyJRYTJxgRRC8CORofGxweH/2gAMAwEAAhEDEQA/ANctXp0BqQ9sOIYeB4jqDwoNs7Eo6hlIjpRHD4gcaOy4gFYGQ8ZgiPeGdfiGjAdY3/rxoXiNlkjNbOYcvvDy41bVYVDxuHCg3FOUjU8j4gUSq9lkZJSrlqKbIo3i9pWX3gk8RGo86EXr1v7pMdY/CtKu/I+QxFyy/caropaqDuINdyUcMDIOYpKdWmhTq1VpaPoadnSmEp07jQmlhBfaK8MgQ+8WkeABn61TcQqsd1Ge0N0k5ugP41WMQugNzOWPAMFQeESYrz+rfdcfxxNjTJisfmQ9q7H9tbYW9XAJUc43jzoV2K2g+cWAYVnDMI35FbeeXTnVu7O2iHQZphhBPU7vprRPtF2Pt4TH+3sqwW4jMw+6Hc8OW5tOtC3ZHMhXDDEdQ6VYOyNsPcYH4Z9CDVcQ6Hwo/wBgQWuM3wqfmY/Ogadc2iMag4qMvIpQrgpQrXMx50UjG4xLNtrlwwiiSf1xpwCs1/adtZnvLhVMIkF+rEZteir82qsJUm9sQH2g20+IZr76SCLa8ETjHU6yeOvSKg93Qsf1yFEto3hBnQCBHXeFHy9DQ3DoGYu+lu2MzctNQPP8KqRk4E0GdakLHxI922xKWV/zLhzt0kd0HwEsfGrthMOLYVBuVQPSg3ZbAMzNibghrklQd4TfPSdB4DrVgTfTtCbeZ5vWXGwkf5mKvUypk0u+1ItrNGzzFMfGKUSZ4U4BPhx6CkDXoBvNMYm9PdXRePXxq0p1FjE52yrog3nix/AdK4+/Sk4ZYNS7mELCQQvViAPnXejOckcyIeMmm8y8z6VKu7PuwJBK81Mj1FS/8KPxr8qICIAq3gSVsXaPsQQZI4DhPhRYdpFj3Wny/PlVcB5Cui25+7QGrU8mOJc6jAlo/jKN1o9Jb8hXLva+44jKqg74kn1/tVbXBXPgPpXjh3G8Gqeyn1Cf1Fn3CeOi4Mye8PnQG5jCdDoeVSgzCoG0befXc3P86viDLZ5jz7aWzbNxzoIEATmJ4QdK7gu3FhveS4vlnA9DmHz8Krl0Zw1q6Inj4bnXnHGn9k4XIgBAzDRvEcfA7/OgX3GoZAjeiq904ziX/CYq3eXNadXHHKZI/wBQ3jzp8VRVuZGzDQ8xoR5jWrJsjbAud1j3uB5+PWu6bXrb8W4M0LtI1YyORDS0+hqOKdQ06wiwlT2r3bly229QCvVTMH0geRoLaRTIMH56coqy9tbOVUxAEhO68fAePkYqo4awM5ZQ5nXMzZhqOBmsDWV7bCZq6azKbYg7QW20AwxaRrxncANTV72tjGv4a3eYkksyxqAoRmUDLPvGCSetUjE2DGYMFjeYk+XI0bweORsK1sNJF/NHEB0Ln/qbfSZ6jPmIE1cv2fL9ndJ35wPLLI+pqnjdV67FL9gTzf8AAVfRjNmZXWHFeJY1pYptaUXA3kDxIH1rSMy46KyD9omHa3jnY7mAZeoyqseqxWvqwO4g+FZv+2mx3LFwaauhbkCFYfRqpmH05w8zBma9cCJ3jML1J3nxP0q139g2hatWtDlYtdPxkaZeqZv/AKxQHYmEgC7qB90Eax8RO/y8Kt4tuiKG3MZA5ASB6yT6U1TTgbm8xDXa33GKL0PP5iDoPlTYMVy49Mu1HPczh1PTJp4DTkOJ/AdabUACTu+Z6Cm2Ysd3gOArolDOXb06DQfrU0rD4Yt0HM7qdtWVHvGegqW2JygExbXcCfw4+ldLACdVC5x3HsNhQusD/U34D9eVFlwtzJNvDvdY+73YBPNmaAF+dS+weCt31e+6FofKhfWYAlsu7jpv3Vd6Us1HhZoVaXb+sfxMqwP7OMW7M9y4louZY5izGf5V7vSJon//AC4//LP9H960Ou0tuM0fcI6mem3Zt6QGPyFOJi590RUdlVd1pj1JH0FLwtws3uwK1cTAz4j/ALZjrS1zRLQB1qdh9ns5EKY9PrUy5s4iMyiBrruPnQmtUQ61MeYDGFFwA5AQeO4nnA3mmcVsxROVhHXLB+c+VT8VkGmh5cI8Cpg+lIW0Lklz56H6muhj3KlF68yrbS2IryNAwO9dYI4xQw4C4gDbwNGjUEc+hH005VpFhcNaYIzB2OuVgJXx5eFE12fYPeW2hniBrHI8xQX1VT5QiFq0VyEWqcTIL1v9frfQ+CDpWl7d7Jgy9geNv/tn6f8AiqLjMEUYggg8iIIrJtq2nInoKbtwwYS2T2hcQt5dPjG8eI41a7ZBEgyDuPSs8ttrqPnFXns7bVrM22bTerQY55SOHSndHrSTsc/zF9TpQBuUSdcthlKsJBEEVS8Z2cu4afYqbtrWACM68YgmGFXVadStC2pXHMSRyp4mJ7T7SPJtWsO+c6d4QZ6ATNG9i7BvYa0tzE6Xb/eyfAigBQY4mTWr21EzAmqr21ufa2xyT6s1ZmooWtCY5TaXcCBga0XsxbjDW+sn1JrObQkgVqmCs5EVB91QPQRS+iXkmH1rcARrau0hYSd7H3R+J6Cs+2t2iW3muYhyx0CiJJJPuqo86KdoscCbjk6DQHgFX9E1nOzcM2KvtiLpi3utLxy/F0B9d1S2wkn6E5VWAB9mEF/aQ9q9FnCXA5HdUNBM7sy5Tp61P7T7ZxO0rdtcTaGGRTmNtXzuxiO8QAFEcNTqd1L/AH8KRbTTThoDGm/j51B2nJIZdTy8qotvGBLtTzuae9tmIiJ+mutG8Q6eyTIwIUQBqSWOrNJA5bqrmFsuWRypyaz07p/t61Ov3gsDTdoOAHKtuly6Anuea1FYqtZV6MUWpwQNW8h+uFQRiBzE06hnqev5USAzHpLHXU8AOFF9k7DvX2yqAo4k8BzMVM7MbBfENqcqD3iB8gN0+taNgcAllMtsQOJ3knmTQbbgvA7jNGnL8nqVhewVrKAb90HiVCCfDMDH1qZY7EYNRDLduce/duHXnAYD5VY4rwFJM5bszSrUVjC8QfsPZa4ayLSmQGY/1MSPQQPKiFdIryiqyx5ngK7Fdr1SSZNldTo589RU3B4l8w1U0Ew+Mu2zDjMBzEkUdw2LtKue7dyrO6I+mp8ga2X+IyZ5+n5the/qXfB3ZUMsEwJE07jcQPZlScrEGJPGqb/F+EUwtxuGgRgIG7lXv4iw7/8AFBPXT61l5rLfqE2yloX9Jkiw66qwMxoQePUcRQPa+1XtaW/e4tvy+HX6Va8LYRgGlW5QQfnTGOwlppzW18Y19d9Mk+4CEPcBVTsYM46mXYi++bMWbfM66+dTdnbWulgj3nCkgABiPkKO7T2Gh9wx0O71qs4nAlW1OUj5daQs0zVcsJqJcH4Et9ntIbFxUvXZRjAbXhyJ31N7R4QfuhvD7S2FzBy0sizJIJkuvMTwrNzjv8sAC5lLqC+4lwbcA74G8nnHKvbU2jetxbR2e0qRGYkSQ3djxaZI3Cl888w20Y4k+6kUV7NbWOHugk9w6MPxqjdnduARhr56WnO7lkY8uR8uVWDcYNCsTaciFrcMMGaljLQBDLqriVNNA1Xuzu3CUGHfUA9xuI6eFWCt7S2+5UCe5k317HIj6GqT2pvZsS38oC/Kfxq6WzWdY29nuu/xOx8p0+VKeothAIxoVy+YY7MYXPiE5L3j5a/WK0N2IViN4Bjxiqp2KsQHueCj6n8KtaVTTJir95NS+bP2mVdqFLWMvB2VW/0nf6gR50DsLcziNFC5WHh7rL4g1de0myzD2gNRqk6Dmnlw9ao+MxWUBXOQg94MQpiNYJ0JFZ7gg4j1ZUrkSRccqWEZhGnDTeIPxD8TUmxtQYay+JuKO4ndVtc11hCLHjqegNRuz8ssAl1H/FIhSP8AUfeP+maIYvC2nKlxnCGVUgZA0Rmy8T1JNdUhDkyOC4wst1zHW7ezPZkIbrogHugywDM2msBgfOqC+AOrMzHwBP0EmizX5M8aav34BJNM1a4ou1REr/TFsbe5xBGAFm6/s0bv8mDKTHATv8KtOw9g3LrhFIHPTQDiaAdjdi3cbi/a21Ps0nvkQubcNeO+fKtu2Vs1LCwupPvNxP8AatE3kLz3MgaZS5A6Ek4HCraQIo0A9TxJ61IpFKBpIzQAwMCdr1crxrk7PV6vA16pJPV6u16pJKftLD4e2jXLgyqokx9AOJ6Vlu1Meb1wvGVdyryH586I7f7QPisoy5EGoWZM82I4xw4SaDiwSNK5qri/xB4h9LQlZ3kcyO7VxLjcNaeOHPKkewPLypDbiaAYGEMBtq5aOkEcju8o1FWTZfaINAcvrwPfA8GifWapap0FOI0btPCqq7IcqcSzKrDDDM0k2s4zWyGHTeKC7VwbOO6FzDg2kjlPCqzh8bctmUZh50cwXasmFvoH/nGjx14NWpV6luTZeMj7EQs0OG3VH+DAO1LAsrmebU8W0XwDbh5+lVa9tYIGUOGB4jmTw4wBpWwWMVh7wKpdVp0KP3SZ6Noapm3f2YW3YvYc2JOqFSyT/KZBXw1FWOnqs5pbP48wZttThxMvxN7OxO4cPCtRw2AurhMPduElntgtO8E6rPXLHzr2wv2c2rLi5fue2IIKqFypI1E6kt4aDxq8YiyLiMjbiPTkaYGgJrO7+IAanDgiUjDYkqQRvFaBsnGi8k8RvrOvYlGIO8Ej0qdhtpGzqjmf1vrM0+oNDkHqaN1AuXI7l521iPZ2HYbyMq+LafmfKqKtk6VPxW0HvFfaHduGmk+H60qI+KUOF01Nc1d/utx0J3S0e2vPc0Hs5ay4dOsk+ZNF7Zqt7O2zat2VDk5hIygSd/pUHHdqHbS2Mg57z68PKnffrRBz4iRosZzgSw9o3s5PtGhx7sat4EcjVIxV9G3qG8RNRb14sZJkmuWsM7GApk7uJ9Kz7LjY3xEfroFa/MxN67O/QVCa6SelW/ZfYy5c1vN7NeQgsfwXzo9aw+BwOvdDj7znM3lO7yAqLpWPLTj6tV4QZlQ2L2WxN+Dl9mnxPI9F3mrVhf2fYaQbzPej7p7qearqfMxT9ztvhQQpurmbcJ18xz6UjafbbC2kDe2AQ/fgxMTG6Z0OlMKldfmKWNbb2OJZ8PYS2oS2qqoEBVAAHgBTorLbf7T7TFnW4iW1MKHDNcuHooIyr1PpVn2d29wt1VOYoTwZHCzx7xER5102rmU9hwOJa6B7W7UWrBKjvsN4B0HnUPa3bCz7E/u7i47SqlZIBBhiSJ3fWqNZw2Yzdg+Jgeiz9RT2moDje3UzNZqWrbYnfn8S4fx5OgsweGrH5Aa0F23tjE3O/Pd/lB08VNKwV1FGhtgQSNGggGCSQJCjxogGsH3wgkSCpIzA9I3eNH/00b4rAEW2Jh3x/wAQPsbtFfSYcmRBkzBG4gHQf3qVf7R4g/8AEYeBqL/hq+1+wbMp3gmCvTkR/ejv8PWVX2l68FXjAn6UrrkL4ZODG/S39oFbeR9mVd+0uJ9oF9q8QSdT0qf/ABDe/wCc3qakO+zQZUvcI3H3Ry4iovtMJ+j/APmhV6S7HUZs9R02eGEp+GYNqQR0YFT86I2Mo4igoxrT730/OpVrGE73gfrxFND05fBmefWH8rCuUMefQKfyqxDs3bOH9q1sg6bmPHjEkChWwcCbxBQEj4iZBjkRoTV42hh7q4eBlgRngkkKDMcp3zVf6WutxzmMV66y1ScYmfYrZC8GPnBqEdkHgR86NXnpqtJvTdO/ayw1dq9GBH2Vc4QfAj8aiXsM671I8qtApxaUs9GpP6SRDr6jYO+ZSy5qdhtq3lGUXHC8sxgeAo/iMBbue8g8RoflQzE7BYaocw5HQ/kazb/SrquV5H4jlWvrfhuI2m07sf5rfj676D7T2id0sTzJJqXdt/dMjnQvGYXrA60kXfOGJjQVMZUCENmt9kDqd/X7xqKbv26TxOoqXsC8AmVSDBIPLnHzrmFtJ7U6ajiSI14Dyj1qhPMso4ndoY72ZUTqZO6eggczTWJuG3bDsJuse6OM8vTTzpWFtrdvu8DLbIVTzI3xruGvnUi3b9tc9oR3UkJ1jew8Tu8qrLwls/FC6gDEhhvBEQeR5UewPZ65cAMAKdxJ3+lVgKAcw3kyfSKsnZrarI4UnuHfJ0HXoaJSEL/ODuLhfhDuC7M2198lj00H50dwmGS37ihfAa+u+m7FxXEoysP5SD8t9PA1rqiAfGZDu5Pyg/tbtj90wt28IlR3Z3STArCLtq9ii17EXHA1bTfG+tm/aJgmvbPvqmrBcwA45CG+gNZps5lu4YMT3SkN0gQaX1OQBiG04BJzEbFW0jEW7STbIBZlDEtEnU66TFWDH3sLiLZtYiyoDRJtko0jcdDEiglm2n2htvJiWHGcsjdzEHSmG+I71KQOjTM893ypIs2eI8FXHMj439naznw+K0Oq5118JBGvlUNexuKRgTeEbyQWHpvnxo9exuS1B01kedR0xzkgK2nEdKJWWYgQFqoils9Sz4XEZEBMTAzHuyWgTuXXyimRduYhsqzHHkB1obmgD2jZRy4n8qNbIujJIVSP5pUDwJUqTxrdPxHE8uvzf5GTb19bYIzKQFyhTZMwNyknrQq/tNiZMA/rhUnH4hXgNduMPhXKBP8AqgfSoYxCj3LSr11J9SZqi8QlhyeOo/Yx1zfBjmTC+XCiyYu60eyz+InTz3UCONfgQDzAE+p1rhxLt7zsfEk11pxSfuHsULTD7YKWHFYzHxy6etQpwnwt/XQPEYpghjexyr58fLfQr2lj429aurNjuCsVM/pBlpwHZC2YzhmPJdBv4ECasOG7E2ANbGvSZ9WOvrVtw1hF9wRPE7vKamWrU6z+ulKvqT4j1ejUDmC9mYL2ChLdnKoPNZ66ZqkbetF8PcVdIE+OUgkeGlE4oT2hxxt2iEdEuEd3Mf6iJ3kCljbht58R1Kv7RM5cU7hsKWW43C2hYxvMbgOpNMYrEZdAVY81mKaXFm0WYie6QT03mTwH5Vpaj1JfaPt9zlWkO8b+onC4p2mbDwDvUHQcQRrr/ejezcNbvKxDOhUah1IPkCJqP2U24rk5rb+zdSFcA5CY3SBp40D2P2mv28Ybd2WtHQht41gGRv8AHjWSnqGoUYz/ALx99JWxzj/aWLF4FrcHQqdzDd/Y0wDVw2rhBpkjLc0YcJj3hy5+XWqcwgxW7otSb157Ey76th46jOL2el33pB5jfQPaXZtspOdcg1JMggeEH5VZENPqQdCJHI1XUaKu3nHM7VqHTgHiUXAWVtocomJO7U/33VJ2ZZKe+NW1p1oFxx1P1pYevKWAhiJ6KrBUGMXsGpUhO6C0sBxBMt603+/oXyKNF94gaSOA5x9fCpdpoNT9ibGW47Joqg5mjfqZjxNStC52juSx1QbjINu7mO6B1qVYw5glVY+AJq4WtlWEiLYPjr9aeubStWzka4imPdkAx4VoL6ae2MQfXj+0SiJfe2dCVPSQaLYLtRiEj7SRybWrKfYX9Dkf0ny41CxHZe03uFk+Y+evzrjaKxeUacGqrb9azlntkYh7SHw0qsXNi4JrrvbN6wLk57aMj2jO+EYSvkRRm72TuD3XU+oqJc7PYhfuE+EH6UJl1A7Espo8GRMP2bw4Lm3egtGjrvIAEyN24VMwXYS5eYMt21pxzEkA/wAsUJxd02nyMGDDeCIqdgdousFSQeYJB9RQ95U/IQpr3D4mTu2XYVLOFW4rs94Oo1ACwQZhRy5kmq3srYbD70fEQGYjyUH6ipu2rxu9571xSdA+YkA8AykxHUR+deuXMRZb3yRz4ecQR51r6YIV3LyZ57WNYH2WZA/8y4ZbOHXL7PM5B7xQAGeIeSYFC7lwneahW9sXHAFySBuIaY8j+dS0htxHnpR9reYsXQ9cCczVwvSntkbxSCKruM7tE5npy4e7TcTpuPyNcsPMqauBKEgGIbUARpqW55eIHU7vWk/4jZ+Oz6ivXbmVACR3tN4Gnn+taY9mOnon50vdYVOBHtLSrLuab5kJOsT4Ax511V6/KKdqtdo9v+zBt2j3+J5dB1pdELnAjFli1rlpP2ttu3YBnVgPdH48qy3bu3GvXWa5cEAwq8AAOCjrOtSNr3iE3ySZJ41WFUG8y5hnZpC8dRNE1On21gLySYLQ6r3LmzwAJJTGBWB1LHmCBVoHaBf3LMiAuHywyg9zj+FVsbKYkFsunU0tsHcXRIg7+XpQW0d+z9JmiNRXu7g7DYu5bxFsWiQlq/nABOVA66mOIEjTjFEe3O3b1zED2dtVAMaABmPxHj+hUSFtOXynMSCY5jdv8Buor+5+1IuXDBI3DfzgmhUaWy5tq+ISy9a1yZaL22HdVXOQyLq0aNMDQEQTEiaHTTKwAAogDcBTeKxa2kNxzCjf+Q616HS6Yaavk/vMq642tmTFp5TVI/ii7eLiwgCrOp11jQeNMbM2/ivaCXDK2oXQkL3d/GdT6UJvUKgcSw07mG9q2gt1oPXzImoOeTUnFX87sTxP/ipmydnC42o7o3n8BXnrU924hPJmxVZ7deW8QZjscMPaLGMx0tr/ADc/Ab/lxop+zu6x9oSScwBJPFp1+tVftsgGKYAQAFAH+0H8TVo/Z/b+yzD4iD6KaNQnt3BfzBXubK90uGIxIRWdtygk+AE1g+2tt3Lt93Bh2MkjhwAHgNK27aNj2tq5bB99GX1BArA8Xg3tMc6sCWYERqCrQVPX+1aWsyAMTPqwTzJGzL99bqsMQ1sgzmZjAjdI67q3Tsltw4myhcj2hUHTTOPiAPIggxO7rWIYXDIR3yxuHcq8JOhYxuHKrr2b7Xf5WGvKAcNc+zOWGC7iBzG8eY5UlVcQcRh6xjM1kNTiNUZXkAjcdRTqGtAiKzm0Nn274i4sxuI0I8/wqp7U7PvZllBdOYEkeKjXzq5qadRqWspVuxCpay9GY3tXaNsKV1MiDKsB8xQrs3euu7W4Z7QBIY/cjcJ4zuit0u4G0+rW1J5xB9RUa5sGw3Bh4H865TUlRyMwWpay4YIEyw7NMyoj8D15V1FIMMNfr+vT6VpJ7LWpkMw9KYxfZBXEZ/CRu8CDTi2p5mW+lu8CUy06kRMdDSLtuKNY7spfSSB7Qc1Pejqv3vLXpQV8yHKw9RFWOD1BYZOCMSO6cQaaxPddGG5jHgaeIHCnMkldJDEbuDDcRVgBKMxzIV17ZZ1uAxuB5QsmOup9Kh/4TY/5z+g/7af2jYKlt/edY/3EL6VPyLyWkrVO6bWjYGoCa1tfaBClbQJMatwHiTu6DeaouImTNHziSSxbM3cYyTlA0juJv8zQWABmYwoGpPIc6Pp12gxDVPvIMjX8LmAzbo1qP+7Wx3lVZ3ZoEkD+bfFKbEtiGC25CkwNNSOLHpyHE0/tBApyD7ojz409UMsMxehdz5HQkBjXJrxrlPxyKFLBpuliq7QJ3McWqrtZnxr+zSUsoe80as26FH48J57rHjHi2Y37vU/l9Krl/HZGUAgTu4Csb1XUFcVr5j2jqDHcfEawd0YZ/ZKiwDBUgyeqtxPjSrWzJxBvn3VBCr/MTPoB8zRXY/ssQx9t/mKjFZy6sokacRXryZFCzMbzzJM1hKfJmmwHQjCLJq27JhbQXie8fPRfkD61V8PbqybOQhATvOvluHyApr02svdu+oHWMFr2zPu192cU5/mj0gVa/wBmV3ML1rjAYeWn5VTe0n/ubk/E31oz+z7Gezxaa6NKnz/QoDvi7d+YVVzVj8TRgapnbjZbKTiUQMpX7QAaqRoH9IBPQVe3w+p8a6MPOhGnGt6wLYkyRlTPn7Z22GtXXYRJ91iNV8OVIv7SNxw7Tn073nu8Ks37QOyNmzdnCsZJ79vTKmmmU9eVRuyfYXF4lpS3Cg6u2ij8z0rLNBU9Q39Qp4zNd7EXGuYS2W1IETzj9RVit4cncDUTslsQ4S0LL3Q7SSDAXLMAhelWO8xAkAnoI18J40Q3EcTmBBLplgNpNdK0RIzaMoIPPiOs6g1HayBIEmOHED8RUW3Pc5iRlalhqQ60maLgGSPzXQaZDUoNXMTseBqDtbZFvELDiG4MN4/MdKlA10NVeRyJxlDDBma7Y2FdsNqJXgw3GouzrwzZTxrU7qKwKsAQd4IkUFxHZSw2ozKeBBmPXX500l4/umXdoXzmsyk4/DFsumguKT4AzPlXP3VuvoPzq/YHs5aWS/2jFcskAQOJXkevSlfw3a+O5/0f9lBdwTHaa3RcGVfG7QOoRS50GY6AAbhJ3+QoPew125rdIgblB7o6nmalG8aQXNalenK9mJPSH/UZIwV/2IlYzRAbkI+7161GuPNJNO2LJJ0pgKqcwqKFG1Y1kpQtVacH2bAQPfuezB+7He/XlTr4DCjcbp/p/KljrUzgZMJsx2ZUfZ17LRzFYS393N5x+Aodi7cDuAT1/tRP6lcZlNy57graLgDLx3/KgAUTBgk891L2pbvTqpJ3yOfnFM7HwuJv3AossxkagfWsDV7733EYmlRbXWuAwMJ2cILZlYjLJB4HcMp5flSTezGjG3sMbR9mYzBRm3GCZ0kchFVe7bk1nXHYcTQpAcbpYdlAXT3dVX3jw6AeNHZoN2YXLbYczJ+gH1oxW/6YmKd33MzWn/UxM37ULGKuDmZ/Gouy8RkuK3JgfQ0U7a4fLic3B1B8xofoKBLoax9Um20j8x6hsoJ9C4LDJiLIh2RmX3ljlw8vOqttMHAui3T7Szc91pnhI1667+XGmOzG3f8A0qIGh148iD3aa7bY5b1lBuS6PaoOR3XV8mE/7W505o7mJ2mZfqNIVd4liwOz8LfylHRyfuOog9Ndx8KKYOxZt5/YIllhIcKgB56jcfGsd2RtBl7rGCDo30n86tSdobpcM5OcCMwgEj+YRrTVlRJ7iFN4A5Xn8TR8DdA0lTIkEcRzINES1U/Ye0rUATB1IHKd8aUfw+OVtxnwG7xpN6yDNGuwER/HMcmdTquu+AeYJr1y2bgFxDluAaTuI35WHKu2H99eR06hhP1kUxhboRwg0Vh3RyI3iKoJc48yLhMULjFYyssi5bO9TwdTxU/jTrJy1/XHlTW39lNcIvWDlxFsd0/EN5U0Ms7V9upuIMl+3pdt8TG8gcR9KYTkZX/qLm0o21v4/P8A9/EK10GmsFjFvLmURBg8p6U6RV/3hwQRkToNdmkV0GuYnY4DSgabWliqmdjgNKmmxSqrJMyVa77OpKJXbjqokkaVvtYBECQoyYwlmpeEuMplDB4GJPkKiYe/mOY7vujh4nrRrCKTugeEUpZaW/aLly54kzDqpBz5m4kvMueA6KKknDKQIAkzAU6AczroB+oqE8jf864twqRlJzHlvpQr9GFDAcERw4LMYDT1jTy5j61FGzJE5tSYXT3vD9RRbB4J394kDXTjrvnlNFbtlEjuDMBGYmAqjiTu8qG1pU4hFpVhkiU7D9lzduhe6V3tcBDAAb4HxcNaL7WxFvAWjbs5QxEIumbMdWuXCNd1I2l2ltWEZbEEn3nMCTzAG+s52ptFrjNcuNLPzjdRURrTl+h4i11iUjbVyx8/URiMdndgTJKg/wDU4/CmVt6zQTamKNu9ayqSzIRoCc3fJAEbyJPrVr2Jsx9Ll/3t4tjcvEZ+b9Nw8YrL1Gna2446m5pNStOnAbuFdmWcqaiCdfy/XWpYNcYQNd+80gNXoqKwlYUeBM9mLncezBHa3ZDYiz9n/mIZXqOK1QxZdNHUhhpBEa1qwao2P2al4agBuDRPrzFJ6zRe6dy9xmi/ZwepnuCxzWzI8akbK2s15TaYybVxmUHgLpLmOmbNPiOdT9o9mcWxy27dkjgwuQI6gqCPnRLsp2AeyXuXriF2WFVZKzIMsSOlIUUWI+SJfVOtte0QR+6FX58uo4T5aUVwpDDKd0d08R0qfjdnm3oRqvzU8vDWoF+1kYa91tQeTf3pwkmZOzbHbOIuWjoT5VMwm2XtvnUmD7wnf+R61CuuARm91tD0bnTOLsQJB0NTP3OY8iaF2e7QC4WR3Mkd0kgfo0R2ofaWfaIe/bObTmN/qKy3A49rTAqRIqy9nO0U38l0jJcBQ/7udDasZ3CHS042tNB2Zixdtgz3oHLfFAe1exGJ/esPK3k1YL94Dj40A2ftZsNfNtmOVGK+QOlXfY22rWJDZDDIYdDv6HqDzoRDVNuXqFymoTY3f/v7mejaV22XxWHMAx+82vuq25biDgh3H4T0Olq2H2hs4kAEhH+E8fCgfaTCnB4n2tsDI8nKfdIOjKw5dPChm3thhEGLwsmw28AybTcQT8M7jwrtybcOnR/zE7o792abP1L/AMj7mivbIpMVnOx+2d6zCuRcTk2/yNW/AdrMLdiX9m3J4if9Qqq2/cbKfUMqKWKSrAjMCCOYII9a5buqwlWBHMGavnMriOiu03mr2apiSGPYJ8K+grhwyfAv9Ip6vUlkwmBGf3ZPgX+kUoWFH3V9BTlermZMCINpfhHoK4LS/CPQU5XqmZMRIUcq8yA6EA0qvVJ2MnCp8C/0ikthbfwJ/SPyqRXGFTM5gQQm0sLnyg2x3M4aFAKnNuP+wnwiu4namFtnKxSYkws8VHAfzL61y32dsgFe8QYnUDQF2AAUAAd9tABXRsC3r37kneZWSfs4Puxp7NIgcNZqTuI62Pww0L2tDGuXfrp8m/pPI0gbTwskZk0VWOmkOzKsaaklTpXrGwbSNmEzmZh7uhcOG+7JHfYwZ9NKRa2BbSMrXAQBBBWQQ1xgQCsCPaOIiIaI0EdyZMRy7tDDKQJtmTEjLAlC8sdwGUT5jnT17E2EMMbYOXNBAHd11PIaH0NRP4bsZBb73swQwSdAwXKGBjNPHfv1p+7shWLEvclgAdV1yMXtn3dCpOnlM1MmSJbaeFETctCRO8btfyP9J5Gpl7Kqk5JgTCgEnoBzoe3Z2yQwOc5sxY5tSXW6rHQRJF193McqnX8GrBwJQuoUukB4ExDRwkxyk1MmSDztayQrNZeCWUkopCshcFTBMmUb3ZHXUUmztbDuEPs9HdkHcVlBVC5JZSViBwJ+Rh07CQhQblwqqFMv2YGVpBEKgymDErBgeNKTYdsBRmfS57Q+73myZNQFgDLpAjfO/WuZkwJGO17GTObDQMpIKJIVxKPv3HcB7xMjLOlLu7TsqxT93cuCIQIksCLhzLLQBFtz3oOg01Er/h+3kKZrkEBW7w1RRlVDpuA3H3tSZkk0r/A17x9pdkuXDSmZWZSrQcu4qcuswAIiBUnMCRDtvC5bji2pW3klh7ET7QqFgM4KjvDVgo360Xs2LbKGFtRIB3Kd4neJHoSKjpslVMq7qQoRIy/ZpIOVJXcco96ToKmYTDrbRbaCFRQoG/QCBrUkxOnDodSinyFdWwoMhQCeQFOV6pJiN3LSt7yg+IBrwsqBAURygR6U5XqkmIx+6W/+Wn9Irv7pb/5af0j8qer1Sdja2VAgKAPAV4WVG5QPIU5XqkkTkHIV7IOQpVeqST//2Q==" alt="" />
              </div>
            </div>
            <div className="feature-content right">
              <h3>Communication Hub</h3>
              <p>Keep volunteers engaged with built-in messaging, notifications, and community features.</p>
            </div>
          </div>
        </div>
      </section>


      <section id="about" className="about">
        <div className="container">
          <div className={`about-content scroll-animate ${isVisible['about'] ? 'visible' : ''}`} id="about">
            <h2>Built for NGOs, by People Who Care</h2>
            <p>We understand the challenges NGOs face in managing volunteers effectively. Our platform is designed to simplify complex processes while maintaining the personal touch that makes volunteer work meaningful.</p>
            <div className="stats">
              <div className="stat">
                <h3>500+</h3>
                <p>NGOs Trust Us</p>
              </div>
              <div className="stat">
                <h3>10,000+</h3>
                <p>Active Volunteers</p>
              </div>
              <div className="stat">
                <h3>50,000+</h3>
                <p>Hours Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="banner cta-banner">
        <div className="banner-content">
          <h3>Ready to Transform Your Volunteer Management?</h3>
          <p>Start your free trial today and see the difference organized volunteer management makes</p>
          <button className="cta-btn primary" onClick={navisignup}>Get Started Now</button>
        </div>
      </section>


      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>VolunteerHub</h4>
              <p>Empowering NGOs through smart volunteer management</p>
            </div>
            <div className="footer-section">
              <h5>Product</h5>
              <a href="#features">Features</a>
            </div>

            <div className="footer-section">
              <h5>Company</h5>
              <a href="#about">About</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 VolunteerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
const mainContainer = document.querySelector(".jobs-main-container");
const clearBtn = document.querySelector(".clear-filters-btn");
const filtersTab = document.querySelector(".filters-tab");
const filtersFlex = document.querySelector(".filters-flex");
let removeBtns;
let tagsContainer;
let tags;
let activeTags = [];
let sectionsTagContainers;

(function generateSkeletons() {
  for (let i = 0; i < 5; i++) {
    let element = document.querySelector(".skeleton-job").cloneNode(true);
    mainContainer.append(element);
  }
})();

fetch("/static-job-listings-master/data.json")
  .then((response) => response.json())
  .then((jobsArr) => {
    mainContainer
      .querySelectorAll(".job")
      .forEach((elem) => mainContainer.removeChild(elem));

    //functions to initiate after fetch is done
    function populateTags(job, jobNode) {
      tagsContainer = jobNode.querySelector(".tags");

      for (let language of job.languages) {
        let tagNode = document.createElement("li");
        tagNode.className = "tag lang";
        tagNode.innerText = language;
        tagsContainer.append(tagNode);
      }
      for (let tool of job.tools) {
        let tagNode = document.createElement("li");
        tagNode.className = "tag tool";
        tagNode.innerText = tool;
        tagsContainer.append(tagNode);
      }
    }

    function filterTags(arr) {
      arr.forEach((obj) => {
        let checkIfIncludes = activeTags.every((t) => obj.tags.includes(t));
        if (checkIfIncludes) {
          gsap.to(obj.belongsTo, 0.25, {
            opacity: 1,
            ease: Power1.ease,
            display: "flex",
          });
        } else {
          function displayNone() {
            setTimeout(() => {
              obj.belongsTo.style.display = "none";
            }, 250);
          }
          gsap.to(obj.belongsTo, 0.25, {
            opacity: 0,
            ease: Power1.ease,
            onComplete: displayNone,
          });
        }
      });
    }

    function listenToTags() {
      tags = document.querySelectorAll(".tag");
      tags.forEach((tag) => {
        tag.addEventListener("click", () => {
          gsap.to(filtersTab, 0.25, {
            height: "auto",
            padding: "2rem",
            overflow: "hidden",
            display: "flex",
          });
          activeTags.includes(tag.innerText)
            ? ""
            : activeTags.push(tag.innerText);

          sectionsTagContainers = [
            ...mainContainer.querySelectorAll("section"),
          ].map((section) => {
            return {
              belongsTo: section,
              tags: [...section.querySelectorAll(".tag")].map(
                (e) => e.innerText
              ),
            };
          });

          filtersTab.style.display = "flex";
          let filterToAdd = document.createElement("li");
          filterToAdd.className = "filter";
          filterToAdd.innerHTML = `<span>${tag.innerText}</span
              ><button class="remove-filter-btn">
                <img src="./images/icon-remove.svg" alt="remove" />
              </button>`;
          if (
            [...filtersFlex.children].every(
              (t) => t.innerText !== filterToAdd.querySelector("span").innerText
            )
          ) {
            filtersFlex.append(filterToAdd);
          }

          filterTags(sectionsTagContainers);

          removeBtns = document.querySelectorAll(".remove-filter-btn");
          removeBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
              filtersFlex.removeChild(btn.closest("li"));
              activeTags.splice(
                activeTags.indexOf(
                  btn.closest("li").querySelector("span").innerText
                ),
                1
              );
              filterTags(sectionsTagContainers);

              if (filtersFlex.children.length === 0) {
                gsap.to(filtersTab, 0.5, {
                  height: "0px",
                  padding: 0,
                  overflow: "hidden",
                  display: "none",
                });
              }
            });
          });
        });
      });
    }

    function generateJobNodes() {
      jobsArr.forEach((job) => {
        let postToBeAdded = document.createElement("section");
        postToBeAdded.id = job.id;
        postToBeAdded.className = `job ${job.new ? "new" : ""} ${
          job.featured ? "featured" : ""
        }`;
        postToBeAdded.innerHTML = `<div class="company-avatar mob-img">
                <img src="${job.logo}" alt="" />
              </div>
              <div class="job-inner">
                <div class="job-info">
                  <div class="company-avatar desk-img">
                    <img src="${job.logo}" alt="" />
                  </div>
                  <div class="job-info-inner">
                    <div class="top">
                      <span class="company-name">${job.company}</span>
                      <span class="new-notifier">NEW!</span>
                      <span class="featured-notifier">FEATURED</span>
                    </div>
                    <h3 class="job-title">${job.position}</h3>
                    <div class="bottom">
                      <span class="posted-at">${job.postedAt}</span>
                      <span class="cooperation-type">${job.contract}</span>
                      <span class="available-in">${job.location}</span>
                    </div>
                  </div>
                </div>
                <ul class="tags">
                  <li class="tag role">${job.role}</li>
                  <li class="tag level">${job.level}</li>
                </ul>
              </div>
            `;
        mainContainer.append(postToBeAdded);
        populateTags(job, postToBeAdded);
      });
      listenToTags();
    }

    generateJobNodes();

    clearBtn.addEventListener("click", () => {
      clearBtn.parentElement.querySelector(".filters-flex").innerHTML = "";
      gsap.to(filtersTab, 0.5, {
        height: 0,
        padding: 0,
        overflow: "hidden",
        display: "none",
      });

      activeTags = [];
      filterTags(sectionsTagContainers);
    });
  });

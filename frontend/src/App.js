import "./App.css";

import { Fragment, useEffect, useRef, useState } from "react";
import { Combobox, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { getBranchName, getCatgory, getfname, getInstName } from "./dataList";
import { RadioGroup } from "@headlessui/react";
import axios from "axios";
import graph from "./graphs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const scrollDown = (ref) => {
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: "smooth",
  });
};

function App() {
  const [currYear, setCurrYear] = useState("2022");
  const [currInstType, setCurrInstType] = useState("IIT");
  const [currQuota, setCurrQuota] = useState("Both");
  const [currInstitute, setCurrInstitute] = useState("");
  const [currProgram, setCurrPogram] = useState("");
  const [currCategory, setCurrCategory] = useState("All");
  const [currGender, setCurrGender] = useState("All");
  const [rank, setRank] = useState("");
  const [delta, setDelta] = useState("");
  const [post, setPost] = useState(null);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(1);
  const [noOfItems, setNoOfItems] = useState(0);
  const [filter, setFilter] = useState("Institute_Name");
  const [isAsc, setIsAsc] = useState(true);
  const [Branch_Name, setBranchName] = useState(getBranchName("All"));
  const [isloading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth >= 640 ? 50 : 20
  );
  // console.log(Branch_Name);
  const Institute_Type = ["IIT", "NIT"];
  const Year = ["2022", "2021", "2020", "2019", "2018", "2017", "2016"];
  const Institute_Name = getInstName(currInstType);
  const Categories = getCatgory();
  const Gender = ["All", "Gender-Neutral", "Female-only"];
  const Quota = ["Both", "HS", "OS"];
  useEffect(() => {
    setCurrInstitute("");
    // setPage(1);
  }, [currInstType]);

  useEffect(() => {
    setPage(1);
    setIsLoading(true);
    // setPost([]);
    axios
      .post("http://localhost:3001/api/v1", {
        Institute_Name: getfname(currInstitute),
        Branch_Name: currProgram,
        Quota: currInstType === "NIT" ? currQuota : "",
        Seat_Type: currCategory,
        Gender: currGender,
        Rank: rank,
        Delta: delta,
        year: currYear,
        Institute_Type: currInstType,
        page: page,
        itemsPerPage: itemsPerPage,
        filter: filter,
        sortType: isAsc ? "asc" : "des",
      })
      .then((res) => {
        setPost(res.data.paginatedInstitutes);
        setNoOfPages(res.data.noOfPages);
        setNoOfItems(res.data.noOfItems);
        setIsLoading(false);
        setItemsPerPage(res.data.itemsPerPage);
        // console.log(res);
      });
  }, [
    currYear,
    currInstType,
    currQuota,
    currInstitute,
    currProgram,
    currGender,
    rank,
    delta,
    page,
    isAsc,
    filter,
  ]);
  useEffect(() => {
    setBranchName(getBranchName(currInstitute));
    // console.log(getBranchName(currInstitute));
  }, [currInstitute]);
  useEffect(() => {
    if (!Branch_Name.includes(currProgram)) {
      setCurrPogram(Branch_Name[0]);
    }
  }, [Branch_Name, currProgram]);

  const scrollRef = useRef(null);
  return (
    <div>
      <div className="mx-3 md:mx-6">
        <div className=" bg-white  sm:rounded-lg">
          <header className="bg-white border-b mb-3 ">
            <div className="max-w-8xl py-6 ">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Jee Opening and Closing Ranks
              </h1>
            </div>
          </header>
          <div className=" rounded-md border border-gray-200">
            <dl>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className=" flex justify-between bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Year
                  </dt>
                  {DropDownItems(currYear, setCurrYear, Year)}
                </div>
                <div className=" flex justify-between md:bg-gray-50 bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Institute Type
                  </dt>
                  <dd
                    className={
                      "flex items-center " +
                      (currInstType === "NIT" ? "grid grid-rows-2" : "")
                    }
                  >
                    <div className="">
                      {MyRadioGroup(
                        currInstType,
                        setCurrInstType,
                        Institute_Type
                      )}
                    </div>
                    {currInstType === "NIT" && (
                      <div className="flex items-center pt-2">
                        {MyRadioGroup(currQuota, setCurrQuota, Quota)}
                      </div>
                    )}
                  </dd>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className=" flex justify-between bg-gray-50 md:bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Institute Name
                  </dt>
                  {MyCombobox(currInstitute, setCurrInstitute, Institute_Name)}
                </div>
                <div className=" flex justify-between bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Program
                  </dt>
                  {MyCombobox(currProgram, setCurrPogram, Branch_Name)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className=" flex justify-between bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Seat Type / Category
                  </dt>
                  {DropDownItems(currCategory, setCurrCategory, Categories)}
                </div>
                <div className=" flex justify-between md:bg-gray-50 bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Gender / Pool
                  </dt>
                  {DropDownItems(currGender, setCurrGender, Gender)}
                </div>
              </div>
            </dl>
          </div>
          <div className="my-3 rounded-md border border-gray-200">
            <dl>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className=" flex justify-between bg-gray-50 md:bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    JEE {currInstType === "IIT" ? "Advance" : "Mains"} Rank
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      step="1"
                      name="Rank"
                      id="Rank"
                      autoComplete="off"
                      placeholder="0"
                      onChange={(e) => setRank(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </dd>
                </div>
                <div className=" flex justify-between bg-gray-50 md:bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex items-center text-md align-middle font-medium text-gray-500">
                    Delta
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      name="Delta"
                      id="Delta"
                      autoComplete="off"
                      placeholder="0"
                      onChange={(e) => setDelta(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div ref={scrollRef} class="relative overflow-x-auto sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 ">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" class="px-6 py-3 ">
                    Year
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 cursor-pointer"
                    onClick={() => {
                      if (filter !== "Institute_Name") {
                        setIsAsc(true);
                        setFilter("Institute_Name");
                      } else {
                        setIsAsc(!isAsc);
                      }
                      // console.log("hi");
                    }}
                  >
                    <div class="flex items-center">
                      Institute Name
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 320 512"
                      >
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 cursor-pointer"
                    onClick={() => {
                      if (filter !== "Branch_Name") {
                        setIsAsc(true);
                        setFilter("Branch_Name");
                      } else {
                        setIsAsc(!isAsc);
                      }
                      // console.log("hi");
                    }}
                  >
                    <div class="flex items-center">
                      Academic Program
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 320 512"
                      >
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      </svg>
                    </div>
                  </th>
                  {currInstType === "NIT" && (
                    <th
                      scope="col"
                      class="px-6 py-3 cursor-pointer"
                      onClick={() => {
                        if (filter !== "Quota") {
                          setIsAsc(true);
                          setFilter("Quota");
                        } else {
                          setIsAsc(!isAsc);
                        }
                        // console.log("hi");
                      }}
                    >
                      <div class="flex items-center">
                        Quota
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-3 h-3 ml-1"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 320 512"
                        >
                          <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                        </svg>
                      </div>
                    </th>
                  )}
                  <th
                    scope="col"
                    class="px-6 py-3 cursor-pointer"
                    onClick={() => {
                      if (filter !== "Seat_Type") {
                        setIsAsc(true);
                        setFilter("Seat_Type");
                      } else {
                        setIsAsc(!isAsc);
                      }
                      // console.log("hi");
                    }}
                  >
                    <div class="flex items-center">
                      Seat Type / Category
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 320 512"
                      >
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 cursor-pointer"
                    onClick={() => {
                      if (filter !== "Gender") {
                        setIsAsc(true);
                        setFilter("Gender");
                      } else {
                        setIsAsc(!isAsc);
                      }
                      // console.log("hi");
                    }}
                  >
                    <div class="flex items-center">
                      Gender / Pool
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 320 512"
                      >
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 cursor-pointer"
                    onClick={() => {
                      if (filter !== "Opening_Rank") {
                        setIsAsc(true);
                        setFilter("Opening_Rank");
                      } else {
                        setIsAsc(!isAsc);
                      }
                      // console.log("hi");
                    }}
                  >
                    <div class="flex items-center">
                      Opening Rank
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 320 512"
                      >
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 cursor-pointer"
                    onClick={() => {
                      if (filter !== "Closing_Rank") {
                        setIsAsc(true);
                        setFilter("Closing_Rank");
                      } else {
                        setIsAsc(!isAsc);
                      }
                      // console.log("hi");
                    }}
                  >
                    <div class="flex items-center">
                      Closing Rank
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 320 512"
                      >
                        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                      </svg>
                    </div>
                  </th>
                  {/* <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th> */}
                </tr>
              </thead>
              <tbody>
                {post != null &&
                  post.map((item) => (
                    <tr class="bg-white border-b hover:bg-gray-50">
                      <td class="px-6 py-4">{item.year}</td>
                      <td class="px-6 py-4">{item.Institute_Name}</td>
                      <td class="px-6 py-4">{item.Branch_Name}</td>
                      {currInstType === "NIT" && (
                        <td class="px-6 py-4">{item.Quota}</td>
                      )}
                      <td class="px-6 py-4">{item.Seat_Type}</td>
                      <td class="px-6 py-4">{item.Gender}</td>
                      <td class="px-6 py-4">{item.Opening_Rank}</td>
                      <td class="px-6 py-4">{item.Closing_Rank}</td>
                    </tr>
                  ))}
                {/* {Pagination2()} */}
              </tbody>
              {/* <tfoot>{Pagination2()}</tfoot> */}
            </table>
          </div>
          {isloading && (
            <tr className="flex items-center justify-between order-y border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="text-center w-full">
                <p className="text-sm text-gray-700 text-center">
                  Loading Results
                </p>
              </div>
            </tr>
          )}
          {!isloading &&
            Pagination(
              page,
              noOfPages,
              setPage,
              scrollRef,
              noOfItems,
              itemsPerPage
            )}
        </div>
      </div>
      <div>{graph()}</div>
    </div>
  );
}

export default App;

function DropDownItems(currView, setCurrView, listItems) {
  const handleSelection = (e) => {
    setCurrView(e);
    // console.log(currView);
  };
  return (
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-48 justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            {currView}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute max-h-60 scrollbar-hide z-10 mt-2 w-full overflow-scroll origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {listItems.map((item) => (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      onClick={() => handleSelection(item)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      {item}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </dd>
  );
}

function MyCombobox(currBranch, setCurrBranch, branchName) {
  const [query, setQuery] = useState("");

  const filteredBranch =
    query === ""
      ? branchName
      : branchName.filter((nm) => {
          return nm.toLowerCase().includes(query.toLowerCase());
        });
  const handleSelection = (e) => {
    setCurrBranch(e);
    setQuery("");
  };
  // useEffect(() => {
  //   console.log(currBranch);
  // }, [currBranch]);
  return (
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      <Combobox
        value={currBranch}
        onChange={setCurrBranch}
        as="div"
        className="relative inline-block text-left"
      >
        <div>
          <Combobox.Button>
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="All"
              className="inline-flex w-48 justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            />
          </Combobox.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Combobox.Options className="absolute max-h-60 scrollbar-hide z-10 mt-2 w-full overflow-scroll origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {filteredBranch.map((item) => (
                <Combobox.Option key={item} value={item}>
                  {({ active }) => (
                    <a
                      onClick={() => handleSelection(item)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      {item}
                    </a>
                  )}
                </Combobox.Option>
              ))}
            </div>
          </Combobox.Options>
        </Transition>
      </Combobox>
    </dd>
  );
}

function MyRadioGroup(plan, setPlan, list) {
  // const list = ["IIT", "NIT"];
  return (
    <RadioGroup
      value={plan}
      onChange={setPlan}
      className="flex inline-flex items-center"
    >
      {/* <RadioGroup.Label>Plan</RadioGroup.Label> */}
      {list.map((item) => (
        <RadioGroup.Option
          key={item}
          value={item}
          className="flex inline-flex items-center pr-4"
        >
          {({ checked }) => (
            <>
              <input
                id={item}
                value={item}
                type="radio"
                checked={checked}
                onChange={() => setPlan(item)}
                class="w-4 h-4 mr-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              />
              <label for={item} className="text-sm font-medium text-gray-700">
                {item}
              </label>
            </>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
}

function Pagination(
  currentPage,
  totalPages,
  onPageChange,
  scrollRef,
  noOfItems,
  itemsPerPage
) {
  const pages = [];
  const handlePageChange = (page) => {
    onPageChange(page);
    // executeScroll();
    scrollDown(scrollRef);
  };

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 4) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(1, "...");
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      pages.push("...", totalPages);
    }
  }

  return (
    <tr className="flex items-center justify-between border-y border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, noOfItems)}
            </span>{" "}
            of <span className="font-medium">{noOfItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <a className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                // className="px-4 py-2 border rounded-l-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </a>
            {window.innerWidth >= 640 &&
              pages.map((page, index) =>
                page === "..." ? (
                  <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <a
                    onClick={() => handlePageChange(page)}
                    className={
                      page === currentPage
                        ? "relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                        : "relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    }
                  >
                    {page}
                  </a>
                )
              )}
            <a>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </a>
          </nav>
        </div>
      </div>
    </tr>
  );
}

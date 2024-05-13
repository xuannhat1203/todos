import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import JobItem from "./JobItem";

type JobType = {
  id: string;
  name: string;
  status: boolean;
};

export default function TodoList() {
  //#region Danh sách các State của component
  const [inputValue, setInputValue] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [listJob, setListJob] = useState<JobType[]>(() => {
    const jobLocal = localStorage.getItem("jobs");

    // Nếu có jobLocal sẽ tiến hành ép kiểu nó về dạng JS , nếu không có sẽ mặc định là một []
    const jobs = jobLocal ? JSON.parse(jobLocal) : [];

    return jobs;
  });
  const [typeButton, setTypeButton] = useState<string>("add");
  const [idUpdate, setIdUpdate] = useState<string>("");

  //#endregion

  //#region Chứa danh sách các hàm của component

  /**
   * Hàm lấy giá trị trong ô input và validate dữ liệu đầu vào
   * @param e Thông số chi tiết của sự kiện
   * Auth: NVQUY (12/05/2024)
   */
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Cập nhật lại trị của State
    setInputValue(e.target.value);

    // Validate dữ liệu đầu vào
    if (e.target.value) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  /**
   * Hàm lưu dữ liệu lên localStorage
   * @param key Key của dữ liệu trên local
   * @param value Value của dữ liệu
   *  Auth: NVQUY (12/05/2024)
   */
  const saveData = (key: string, value: any) => {
    // Lưu dữ liệu lên local
    localStorage.setItem(key, JSON.stringify(value));

    // Cập nhật State để component được re-render
    setListJob(value);
  };

  /**
   * Hàm thêm mới công việc
   *  Auth: NVQUY (12/05/2024)
   */
  const handleCreateJob = (): void => {
    // Kiểm tr dữ liệu đầu vào
    if (inputValue) {
      // Bước 1: Tạo đối tượng Job
      const job: JobType = {
        id: uuidv4(),
        name: inputValue,
        status: false,
      };
      // Bước 2: Push dữ liệu vào mảng (mảng này lấy từ localStorage)
      listJob.push(job);

      // Bước 3: Lưu danh sách công việc lên localStorage
      saveData("jobs", listJob);

      // Bước 4: Reset giá trị trong ô input
      setInputValue("");
    } else {
      setShowError(true);
    }
  };

  /**
   * Hàm xóa thông tin một công việc theo id
   * @param id Id của công việc cần xóa
   *  Auth: NVQUY (12/05/2024)
   */
  const handleDelete = (id: string) => {
    // Lọc ra những công việc có id khác với id cần xóa
    const filterJob = listJob.filter((job: JobType) => job.id !== id);

    // Lưu mảng mới lên local
    saveData("jobs", filterJob);
  };

  /**
   * Hàm cập nhật trạng thái công việc
   * @param id Id của công việc cần cập nhật
   * Auth: NVQUY (12/05/2024)
   */
  const handleChecked = (id: string) => {
    // Cập nhật trạng thái của công việc theo id
    // option: dùng hàm findIndex lấy ra vị trí công việc và cập nhật nó
    const updateJobs: JobType[] = listJob.map((job: JobType) => {
      // Kiểm tra công việc cần update theo id
      if (job.id === id) {
        return { ...job, status: !job.status };
      }
      return job;
    });

    // Lưu dữ liệu mới nhất lên localStorage
    saveData("jobs", updateJobs);
  };

  /**
   * Hàm đếm số lượng công việc đã hoàn thành
   * @returns Số lượng công việc đã hoàn thành
   * Auth: NVQUY (12/05/2024)
   */
  const totalCountJobSuccess = () => {
    // Lọc ra những công việc có status là true

    // const filterJobSuccess = listJob.filter((job: JobType) => {
    //   return job.status === true;
    // });

    const filterJobSuccess = listJob.filter((job: JobType) => job.status);

    // Trả về độ dài của mảng trên
    return filterJobSuccess.length;
  };

  // Tìm kiếm công việc và fill lên input
  const handleUpdateName = (id: string) => {
    const findJob = listJob.find((job: JobType) => job.id === id);
    if (findJob) {
      setTypeButton("edit");
      setInputValue(findJob?.name);
      setIdUpdate(id);
    }
  };

  // Cập nhật lại giá trị và thông tin công việc mới lên localStorage
  const handleSaveUpdate = () => {
    const updateJobs = listJob.map((job: JobType) => {
      if (job.id === idUpdate) {
        return { ...job, name: inputValue };
      }
      return job;
    });

    saveData("jobs", updateJobs);

    // Cập nhật lại các State mặc định
    setInputValue("");
    setTypeButton("add");
  };

  return (
    <>
      <div className="main">
        <div className="todo-container">
          <header>
            <h3 className="header-title">Danh sách công việc</h3>
            <div className="job-input">
              <input
                value={inputValue}
                onChange={handleChangeValue}
                className="input"
                type="text"
              />
              {typeButton === "add" ? (
                <>
                  <button onClick={handleCreateJob} className="btn btn-add">
                    Thêm
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSaveUpdate} className="btn btn-add">
                    Cập nhật
                  </button>
                </>
              )}
            </div>
            {
              // showError === true ? ( <p className="error">Tên công việc không được để trống.</p>) : (<></>)
              // showError ? ( <p className="error">Tên công việc không được để trống.</p>) : (<></>)
              showError && (
                <p className="error">Tên công việc không được để trống.</p>
              )
            }
          </header>
          <ul className="list-job">
            {listJob.map((job: JobType) => (
              <div key={job.id}>
                <JobItem
                  job={job}
                  handleDelete={handleDelete}
                  handleChecked={handleChecked}
                  handleUpdateName={handleUpdateName}
                />
              </div>
            ))}
          </ul>
          <footer className="job-footer">
            {totalCountJobSuccess() === listJob.length ? (
              <>
                <span>Hoàn thành công việc</span>
              </>
            ) : (
              <>
                <span>Số công việc hoàn thành</span>:
                <b>{totalCountJobSuccess()}</b>
              </>
            )}
          </footer>
        </div>
      </div>
    </>
  );
}
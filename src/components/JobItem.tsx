type JobType = {
  id: string;
  name: string;
  status: boolean;
};
type PropType = {
  job: JobType;
  handleDelete: (id: string) => void;
  handleChecked: (id: string) => void;
  handleUpdateName: (id: string) => void;
};

export default function JobItem({
  job,
  handleDelete,
  handleChecked,
  handleUpdateName,
}: PropType) {
  return (
    <>
      <li className="job-item">
        <div className="item-left">
          <input
            onChange={() => handleChecked(job.id)}
            checked={job.status}
            className="input-checkbox"
            type="checkbox"
          />
          {job.status ? (
            <s className="job-name">{job.name}</s>
          ) : (
            <span className="job-name">{job.name}</span>
          )}
        </div>
        <div className="item-right">
          <button
            onClick={() => handleUpdateName(job.id)}
            className="btn btn-edit"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDelete(job.id)}
            className="btn btn-delete"
          >
            Xóa
          </button>
        </div>
      </li>
    </>
  );
}

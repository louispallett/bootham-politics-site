export default function Loading() {
  return (
    <div className="flex items-center justify-center mt-16">
    	<div className="users-container bg-blue-500! flex gap-2.5 p-4 items-center rounded-md">
    	    <img src="/images/bootham-logo.png" alt="" className="h-18" />
    	    <div className="spinner h-12 w-12" />
	</div>
    </div>
  );
}


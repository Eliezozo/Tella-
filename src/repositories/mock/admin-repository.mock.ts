import {
  listPendingRegistrationsFromMock,
  setTailorApprovalInMock,
} from "@/repositories/mock/auth-repository.mock";

export function listPendingTailorsInMock() {
  return listPendingRegistrationsFromMock();
}

export function approveTailorInMock(tailorProfileId: string) {
  setTailorApprovalInMock(tailorProfileId, { isApproved: true });
}

export function publishTailorInMock(tailorProfileId: string) {
  setTailorApprovalInMock(tailorProfileId, { isApproved: true, isPublished: true });
}
